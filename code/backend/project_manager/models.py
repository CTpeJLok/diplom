from typing import TYPE_CHECKING

from django.db import models

from user_manager.models import CustomUser

if TYPE_CHECKING:
    from task_manager.models import Task
    from kanban_manager.models import KanbanTODO, KanbanINPROGRESS, KanbanDONE


class Project(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    project_users: models.QuerySet["ProjectUser"]
    tasks: models.QuerySet["Task"]

    kanban_kanbantodo: models.QuerySet["KanbanTODO"]
    kanban_kanbaninprogress: models.QuerySet["KanbanINPROGRESS"]
    kanban_kanbandone: models.QuerySet["KanbanDONE"]

    def __str__(self) -> str:
        return f"{self.name}"

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"


class ProjectUser(models.Model):
    project = models.ForeignKey(
        to=Project,
        on_delete=models.CASCADE,
        related_name="project_users",
        verbose_name="Проект",
    )
    user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name="project_users",
        verbose_name="Пользователь",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Участник проекта"
        verbose_name_plural = "Участники проекта"
