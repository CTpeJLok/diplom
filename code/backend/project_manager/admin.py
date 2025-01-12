from django.contrib import admin

from .models import Project, ProjectUser


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]


@admin.register(ProjectUser)
class ProjectUserAdmin(admin.ModelAdmin):
    list_display = ["project", "user"]
