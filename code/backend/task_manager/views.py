from django.db.models import QuerySet
from django.db.transaction import atomic
from project_manager.decorators import validate_project_user
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from task_manager.serializers import TaskSerializer

from .models import Task


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def get_tasks(request, project_id: int) -> Response:
    tasks: QuerySet[Task] = Task.objects.filter(project_id=project_id)

    result = [dict(TaskSerializer(i).data) for i in tasks]

    return Response(
        {
            "tasks": result,
        }
    )


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def get_kanban_tasks(request, project_id: int) -> Response:
    tasks: QuerySet[Task] = Task.objects.filter(
        project_id=project_id, is_show_in_kanban=True
    )

    result = [dict(TaskSerializer(i).data) for i in tasks]

    return Response(
        {
            "tasks": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@validate_project_user
def create_task(request, project_id: int) -> Response:
    name = request.data.get("name")
    description = request.data.get("description")
    stage = request.data.get("stage")
    is_show_in_kanban = request.data.get("is_show_in_kanban")
    if not name or not description:
        return Response(
            {"detail": "Missing name or description"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task: Task = Task.objects.create(
        project_id=project_id,
        name=name,
        description=description,
    )

    if stage:
        task.stage = stage
    if is_show_in_kanban is not None:
        task.is_show_in_kanban = is_show_in_kanban

    task.save()

    result = dict(TaskSerializer(task).data)

    return Response(
        {
            "task": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@validate_project_user
def update_task(request, project_id: int, task_id: int) -> Response:
    name = request.data.get("name")
    description = request.data.get("description")
    stage = request.data.get("stage")
    is_show_in_kanban = request.data.get("is_show_in_kanban")
    if not name and not description and not stage and is_show_in_kanban is None:
        return Response(
            {"detail": "Missing name or description or stage or is_show_in_kanban"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task: Task | None = Task.objects.filter(id=task_id).first()
    if task is None:
        return Response(
            {"detail": "Task not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if name:
        task.name = name
    if description:
        task.description = description
    if stage:
        task.stage = stage
    if is_show_in_kanban is not None:
        task.is_show_in_kanban = is_show_in_kanban

    task.save()

    result = dict(TaskSerializer(task).data)

    return Response(
        {
            "task": result,
        }
    )


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def delete_task(request, project_id: int, task_id: int) -> Response:
    Task.objects.filter(id=task_id).delete()
    return Response({})
