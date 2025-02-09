from threading import stack_size
from unittest import result
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import KanbanTODO, KanbanINPROGRESS, KanbanDONE

from utils.project import validate_project


def task_to_dict(task):
    return {
        "id": task.id,
        "name": task.name,
        "description": task.description,
        "created_at": task.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": task.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        "created_by": task.created_by.username,
        "updated_by": task.updated_by.username if task.updated_by else None,
    }


def get_kanban_dict(project_user):
    return {
        "todo": [
            task_to_dict(task)
            for task in project_user.project.kanban_kanbantodo.all().order_by(
                "created_at"
            )
        ],
        "inprogress": [
            task_to_dict(task)
            for task in project_user.project.kanban_kanbaninprogress.all().order_by(
                "created_at"
            )
        ],
        "done": [
            task_to_dict(task)
            for task in project_user.project.kanban_kanbandone.all().order_by(
                "created_at"
            )
        ],
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_kanban(request, project_id):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    return Response({"data": get_kanban_dict(project_user)}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_kanban(request, project_id):
    name = request.data.get("name")
    description = request.data.get("description")
    st = request.data.get("status")
    if not name or not description or not st:
        return Response(
            {"detail": "Missing name or description or status"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    if st == "TODO":
        KanbanTODO.objects.create(
            project=project_user.project,
            name=name,
            description=description,
            created_by=request.user,
        )
    elif st == "IN_PROGRESS":
        KanbanINPROGRESS.objects.create(
            project=project_user.project,
            name=name,
            description=description,
            created_by=request.user,
        )
    elif st == "DONE":
        KanbanDONE.objects.create(
            project=project_user.project,
            name=name,
            description=description,
            created_by=request.user,
        )

    return Response(
        {"data": get_kanban_dict(project_user)},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def delete_kanban(request, project_id, task_id, type):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    if type == 0:
        KanbanTODO.objects.filter(id=task_id).delete()
    elif type == 1:
        KanbanINPROGRESS.objects.filter(id=task_id).delete()
    elif type == 2:
        KanbanDONE.objects.filter(id=task_id).delete()

    return Response({"data": get_kanban_dict(project_user)}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def move_next(request, project_id, task_id, type):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    task = None
    if type == 0:
        task = KanbanTODO.objects.filter(id=task_id).first()
    elif type == 1:
        task = KanbanINPROGRESS.objects.filter(id=task_id).first()

    if not task:
        return Response(
            {"detail": "Task not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if type == 0:
        KanbanINPROGRESS.objects.create(
            project=project_user.project,
            name=task.name,
            description=task.description,
            created_at=task.created_at,
            updated_at=task.updated_at,
            created_by=task.created_by,
            updated_by=request.user,
        )
        task.delete()
    elif type == 1:
        KanbanDONE.objects.create(
            project=project_user.project,
            name=task.name,
            description=task.description,
            created_at=task.created_at,
            updated_at=task.updated_at,
            created_by=task.created_by,
            updated_by=request.user,
        )
        task.delete()

    return Response({"data": get_kanban_dict(project_user)}, status=status.HTTP_200_OK)
