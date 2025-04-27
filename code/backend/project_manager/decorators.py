from functools import wraps

from rest_framework import status
from rest_framework.response import Response

from .models import ProjectUser


def validate_project_user(func):
    @wraps(func)
    def wrapper(request, project_id, *args, **kwargs):
        validate_result: bool = ProjectUser.objects.filter(
            project_id=project_id,
            user=request.user,
        ).exists()

        if not validate_result:
            return Response(
                {"detail": "You are not a member of this project"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return func(request, project_id, *args, **kwargs)

    return wrapper
