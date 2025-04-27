from django.contrib import admin

from .models import Note, NoteBlock


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = [
        "project",
        "name",
    ]


@admin.register(NoteBlock)
class NoteBlockAdmin(admin.ModelAdmin):
    list_display = [
        "note",
        "block_type",
    ]
