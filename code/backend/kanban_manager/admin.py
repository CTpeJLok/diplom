from django.contrib import admin

from .models import KanbanTODO, KanbanINPROGRESS, KanbanDONE


@admin.register(KanbanTODO, KanbanINPROGRESS, KanbanDONE)
class KanbanAdmin(admin.ModelAdmin):
    list_display = [
        "project",
        "name",
    ]
