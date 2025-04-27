from django.db.models import QuerySet
from note_manager.serializers import NoteSerializer
from project_manager.decorators import validate_project_user
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Note, NoteBlock


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def get_notes(request, project_id: int) -> Response:
    notes: QuerySet[Note] = Note.objects.filter(project_id=project_id)

    result = [dict(NoteSerializer(i).data) for i in notes]

    return Response(
        {
            "notes": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@validate_project_user
def create_note(request, project_id: int) -> Response:
    name = request.data.get("name")
    description = request.data.get("description")
    if not name or not description:
        return Response(
            {"detail": "Missing name or description"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    note: Note = Note.objects.create(
        project_id=project_id,
        name=name,
        description=description,
    )

    result = dict(NoteSerializer(note).data)

    return Response(
        {
            "note": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@validate_project_user
def update_note(request, project_id: int, note_id: int) -> Response:
    name = request.data.get("name")
    description = request.data.get("description")
    if not name and not description:
        return Response(
            {"detail": "Missing name or description"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    note: Note | None = Note.objects.filter(id=note_id).first()
    if note is None:
        return Response(
            {"detail": "Note not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if name:
        note.name = name
    if description:
        note.description = description

    note.save()

    result = dict(NoteSerializer(note).data)

    return Response(
        {
            "note": result,
        }
    )


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def delete_note(request, project_id: int, note_id: int) -> Response:
    Note.objects.filter(id=note_id).delete()
    return Response({})


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def get_note_blocks(request, project_id: int, note_id: int) -> Response:
    note_blocks: QuerySet[NoteBlock] = NoteBlock.objects.filter(
        note_id=note_id
    ).order_by("order")

    result = [dict(NoteSerializer(i).data) for i in note_blocks]

    return Response(
        {
            "note_blocks": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@validate_project_user
def create_note_block(request, project_id: int, note_id: int) -> Response:
    block_type = request.data.get("block_type")
    if not block_type:
        return Response(
            {"detail": "Missing block type"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    last_block: NoteBlock | None = NoteBlock.objects.filter(note_id=note_id).last()
    last_index: int = 1 if last_block is None else last_block.order + 1

    note_block: NoteBlock = NoteBlock.objects.create(
        note_id=note_id,
        block_type=block_type,
        order=last_index,
    )

    result = dict(NoteSerializer(note_block).data)

    return Response(
        {
            "note_block": result,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
@validate_project_user
def update_note_block(
    request, project_id: int, note_id: int, note_block_id: int
) -> Response:
    text = request.data.get("text")
    image = request.data.get("image")
    if text is None and not image:
        return Response(
            {"detail": "Missing text or image"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    note_block: NoteBlock | None = NoteBlock.objects.filter(id=note_block_id).first()
    if note_block is None:
        return Response(
            {"detail": "Note block not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if text is not None:
        note_block.text = text
    if image:
        note_block.image = image

    note_block.save()

    result = dict(NoteSerializer(note_block).data)

    return Response(
        {
            "note_block": result,
        }
    )


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def delete_note_block(
    request, project_id: int, note_id: int, note_block_id: int
) -> Response:
    NoteBlock.objects.filter(id=note_block_id).delete()
    return Response({})


@api_view()
@permission_classes([IsAuthenticated])
@validate_project_user
def change_note_block_order(
    request,
    project_id: int,
    note_id: int,
    note_block_id: int,
    order: int,
) -> Response:
    note_block: NoteBlock | None = NoteBlock.objects.filter(id=note_block_id).first()
    if note_block is None:
        return Response(
            {"detail": "Note block not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 1 for next, any for previous
    if order == 1:
        next_block: NoteBlock | None = NoteBlock.objects.filter(
            note_id=note_id,
            order__gt=note_block.order,
        ).first()

        if next_block is None:
            return Response(
                {"detail": "Next block not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        next_block_order = next_block.order

        next_block.order = note_block.order
        note_block.order = next_block_order

        next_block.save()
        note_block.save()
        return Response()

    prev_block: NoteBlock | None = NoteBlock.objects.filter(
        note_id=note_id,
        order__lt=note_block.order,
    ).last()

    if prev_block is None:
        return Response(
            {"detail": "Previous block not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    prev_block_order = prev_block.order

    prev_block.order = note_block.order
    note_block.order = prev_block_order

    prev_block.save()
    note_block.save()

    blocks = NoteBlock.objects.filter(note_id=note_id).order_by("order")
    result = [dict(NoteSerializer(i).data) for i in blocks]
    return Response(
        {
            "note_blocks": result,
        }
    )
