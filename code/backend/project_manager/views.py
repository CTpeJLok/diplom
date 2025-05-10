from uuid import UUID, uuid4

from django.db.models import QuerySet
from django.db.transaction import atomic
from django.http import HttpResponsePermanentRedirect, HttpResponseRedirect
from django.shortcuts import redirect
from django.utils import timezone
from email_manager.main import send_email_invite_code
from project_manager.decorators import validate_project_user
from project_manager.serializers import ProjectSerializer, ProjectUserSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from user_manager.models import CustomUser

from .models import Project, ProjectUser


@api_view()
@permission_classes([IsAuthenticated])
def get_projects(request) -> Response:
    projects: QuerySet[Project] = Project.objects.filter(
        project_users__user=request.user,
        project_users__invite_code__isnull=True,
    )

    result = [dict(ProjectSerializer(i).data) for i in projects]

    return Response(
        {
            "projects": result,
        }
    )


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def get_project(request, project_id: int) -> Response:
    project: Project = Project.objects.get(id=project_id)

    result = dict(ProjectSerializer(project).data)

    return Response(
        {
            "project": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project(request) -> Response:
    name = request.data.get("name")
    description = request.data.get("description")
    if not name:
        return Response(
            {"detail": "Missing name"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    result = {}
    with atomic():
        project: Project = Project.objects.create(
            name=name,
            description=description,
        )
        ProjectUser.objects.create(
            project=project,
            user=request.user,
            role=ProjectUser.ROLE_CREATOR,
        )

        result = dict(ProjectSerializer(project).data)

    return Response(
        {
            "project": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@validate_project_user
def update_project(request, project_id: int) -> Response:
    project: Project = Project.objects.get(id=project_id)

    name = request.data.get("name")
    description = request.data.get("description")

    if name:
        project.name = name
    if description:
        project.description = description

    project.save()

    result = dict(ProjectSerializer(project).data)

    return Response(
        {
            "project": result,
        }
    )


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def delete_project(request, project_id: int) -> Response:
    project_user: ProjectUser = ProjectUser.objects.get(
        project_id=project_id,
        user=request.user,
    )

    if project_user.role != ProjectUser.ROLE_CREATOR:
        return Response(
            {"detail": "Only the creator can delete the project"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    Project.objects.filter(id=project_id).delete()
    return Response({})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@validate_project_user
def create_send_invite(request, project_id: int) -> Response:
    project_user: ProjectUser = ProjectUser.objects.get(
        project_id=project_id,
        user=request.user,
    )

    if project_user.role != ProjectUser.ROLE_CREATOR:
        return Response(
            {"detail": "Only the creator can invite users"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = request.data.get("email")
    if not email:
        return Response(
            {"detail": "Missing email"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user: CustomUser | None = CustomUser.objects.filter(username=email).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if ProjectUser.objects.filter(project_id=project_id, user=user).exists():
        return Response(
            {"detail": "User is already a member of this project"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with atomic():
        project_user: ProjectUser = ProjectUser.objects.create(
            project_id=project_id,
            user=user,
            role=ProjectUser.ROLE_ADMIN,
            invite_code=uuid4(),
        )

        send_email_invite_code(
            user.username,
            project_user.project.name,
            project_id,
            user.pk,
            project_user.invite_code,
        )

        project_user.last_sent_at = timezone.now()
        project_user.save()

    return Response({"detail": "Invite sent"})


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def resend_invite(
    request, project_id: int, user_id: int, invite_code: UUID
) -> Response:
    user: CustomUser | None = CustomUser.objects.filter(pk=user_id).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project_user: ProjectUser | None = ProjectUser.objects.filter(
        project_id=project_id,
        user=user,
        invite_code__isnull=False,
    ).first()

    if project_user is None:
        return Response(
            {"detail": "User is not a member of this project or has not been invited"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if project_user.last_sent_at is not None:
        if (timezone.now() - project_user.last_sent_at).total_seconds() < 60:
            return Response(
                {"detail": "Invite has already been sent"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    send_email_invite_code(
        user.username,
        project_user.project.name,
        project_id,
        user_id,
        project_user.invite_code,
    )

    project_user.last_sent_at = timezone.now()
    project_user.save()

    return Response({"detail": "Invite resent"})


@api_view()
def accept_invite(
    request, project_id: int, user_id: int, invite_code: UUID
) -> Response | HttpResponseRedirect:
    user: CustomUser | None = CustomUser.objects.filter(pk=user_id).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project_user: ProjectUser | None = ProjectUser.objects.filter(
        project_id=project_id,
        user=user,
        invite_code=invite_code,
    ).first()

    if project_user is None:
        return Response(
            {"detail": "Invite code is invalid"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project_user.invite_code = None
    project_user.save()

    return redirect("/", permanent=False)

    # return Response({"detail": "Invite accepted"})


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def reject_invite(request, project_id: int, user_id: int) -> Response:
    user: CustomUser | None = CustomUser.objects.filter(pk=user_id).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project_user: ProjectUser | None = ProjectUser.objects.filter(
        project_id=project_id,
        user=user,
    ).first()

    if project_user is None:
        return Response(
            {"detail": "User is not a member of this project"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project_user.delete()

    return Response({"detail": "Invite rejected"})


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def get_project_users(request, project_id: int) -> Response:
    project: Project = Project.objects.get(id=project_id)

    result = [dict(ProjectUserSerializer(i).data) for i in project.project_users.all()]

    return Response(
        {
            "project_users": result,
        }
    )
