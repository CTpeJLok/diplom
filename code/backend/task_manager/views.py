from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from task_manager.models import Task
from project_manager.models import ProjectUser


def task_to_dict(task):
    return {
        "id": task.id,
        "name": task.name,
        "description": task.description,
        "created_at": task.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": task.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        "is_done": task.is_done,
        "done_at": task.done_at,
        "created_by": {
            "id": task.created_by.id,
            "username": task.created_by.username,
        },
        "updated_by": (
            {
                "id": task.updated_by.id,
                "username": task.updated_by.username,
            }
            if task.updated_by
            else None
        ),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request, project_id, count=None):
    project_user = (
        ProjectUser.objects.select_related("project")
        .filter(
            user=request.user,
            project_id=project_id,
        )
        .first()
    )
    if not project_user:
        return Response(
            {"detail": "You are not a member of this project"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    tasks = project_user.project.tasks.all()
    if count:
        tasks = tasks[:count]

    return Response(
        {"data": [task_to_dict(task) for task in tasks]},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request, project_id):
    name = request.data.get("name")
    description = request.data.get("description")
    if not name or not description:
        return Response(
            {"detail": "Missing name or description"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project_user = (
        ProjectUser.objects.select_related("project")
        .filter(
            user=request.user,
            project_id=project_id,
        )
        .first()
    )
    if not project_user:
        return Response(
            {"detail": "You are not a member of this project"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task = Task.objects.create(
        project=project_user.project,
        name=name,
        description=description,
        created_by=request.user,
    )

    tasks = project_user.project.tasks.all()

    return Response(
        {"data": [task_to_dict(task) for task in tasks]},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_task(request, project_id, task_id):
    project_user = (
        ProjectUser.objects.select_related("project")
        .filter(
            user=request.user,
            project_id=project_id,
        )
        .first()
    )
    if not project_user:
        return Response(
            {"detail": "You are not a member of this project"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task = Task.objects.filter(id=task_id).first()
    if not task:
        return Response(
            {"detail": "Task not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task.is_done = not task.is_done
    task.updated_by = request.user
    task.save()

    tasks = project_user.project.tasks.all()

    return Response(
        {"data": [task_to_dict(task) for task in tasks]},
        status=status.HTTP_200_OK,
    )
