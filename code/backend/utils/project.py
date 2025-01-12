from rest_framework import status
from rest_framework.response import Response

from project_manager.models import ProjectUser


def validate_project(user, project_id):
    project_user = (
        ProjectUser.objects.select_related("project")
        .filter(
            user=user,
            project_id=project_id,
        )
        .first()
    )
    if not project_user:
        return None, Response(
            {"detail": "You are not a member of this project"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return project_user, None
