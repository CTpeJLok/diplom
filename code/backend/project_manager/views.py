from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Project, ProjectUser

from user_manager.models import CustomUser

from utils.project import validate_project


def project_to_dict(project):
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
    }


def project_user_to_dict(project_user):
    return {
        "id": project_user.id,
        "project": project_to_dict(project_user.project),
        "user": {
            "id": project_user.user.id,
            "username": project_user.user.username,
        },
        "createdAt": project_user.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "updatedAt": project_user.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_projects(request):
    project_users = ProjectUser.objects.select_related("project").filter(
        user=request.user
    )

    return Response(
        {
            "data": [
                project_to_dict(project_user.project) for project_user in project_users
            ]
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_project(request, project_id):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    return Response(
        {"data": project_to_dict(project_user.project)}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project(request):
    name = request.data.get("name")
    description = request.data.get("description")
    if not name or not description:
        return Response(
            {"detail": "Missing name or description"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if Project.objects.filter(name=name).exists():
        return Response(
            {"detail": "Project already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project = Project.objects.create(
        name=name,
        description=description,
    )
    ProjectUser.objects.create(
        project=project,
        user=request.user,
    )

    return Response({"data": project_to_dict(project)}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_team(request, project_id, count=None):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    project_users = project_user.project.project_users.all()
    if count:
        project_users = project_users[:count]

    return Response(
        {
            "data": [
                project_user_to_dict(project_user) for project_user in project_users
            ]
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_team(request, project_id):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    username = request.data.get("username")
    if not username:
        return Response(
            {"detail": "Missing username"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = CustomUser.objects.filter(username=username).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if ProjectUser.objects.filter(project=project_user.project, user=user).exists():
        return Response(
            {"detail": "User already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ProjectUser.objects.create(project=project_user.project, user=user)

    project_users = project_user.project.project_users.all()

    return Response(
        {
            "data": [
                project_user_to_dict(project_user) for project_user in project_users
            ]
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_team(request, project_id, team_id):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    to_delete = ProjectUser.objects.filter(id=team_id).first()
    if not to_delete:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    to_delete.delete()

    project_users = project_user.project.project_users.all()

    return Response(
        {
            "data": [
                project_user_to_dict(project_user) for project_user in project_users
            ]
        },
        status=status.HTTP_200_OK,
    )
