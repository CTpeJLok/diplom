from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        "project",
        "name",
        "stage",
        "is_show_in_kanban",
    ]

    list_filter = [
        "stage",
    ]
