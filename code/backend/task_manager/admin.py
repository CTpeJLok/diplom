from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        "project",
        "name",
        "is_done",
    ]

    list_filter = [
        "is_done",
    ]
