from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Project, ProjectUser

from utils.project import validate_project


def project_to_dict(project):
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
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
