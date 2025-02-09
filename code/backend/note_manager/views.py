from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Note

from utils.project import validate_project


def note_to_dict(note):
    return {
        "id": note.id,
        "name": note.name,
        "createdAt": note.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "updatedAt": note.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        "createdBy": note.created_by.username if note.created_by else None,
        "updatedBy": note.updated_by.username if note.updated_by else None,
        "content": note.content,
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notes(request, project_id):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    notes = project_user.project.notes.all()

    return Response(
        {"data": [note_to_dict(note) for note in notes]},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_note(request, project_id):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    name = request.data.get("name")
    if not name:
        return Response(
            {"detail": "Missing name"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if Note.objects.filter(project=project_user.project, name=name).exists():
        return Response(
            {"detail": "Note already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    Note.objects.create(
        project=project_user.project,
        name=name,
        created_by=request.user,
        content="",
    )

    notes = project_user.project.notes.all()

    return Response(
        {"data": [note_to_dict(note) for note in notes]},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_note(request, project_id, note_pk):
    project_user, error = validate_project(request.user, project_id)

    if not project_user:
        return error

    note = Note.objects.filter(id=note_pk).first()
    if not note:
        return Response(
            {"detail": "Note not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    content = request.data.get("content")
    if not content:
        return Response(
            {"detail": "Missing content"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    note.content = content
    note.updated_by = request.user
    note.save()

    return Response(
        {"content": note.content},
        status=status.HTTP_200_OK,
    )
