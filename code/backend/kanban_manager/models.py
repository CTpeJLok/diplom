from django.db import models

from project_manager.models import Project
from user_manager.models import CustomUser


class KanbanTask(models.Model):
    project = models.ForeignKey(
        to=Project,
        on_delete=models.CASCADE,
        related_name="kanban_%(class)s",
        verbose_name="Проект",
    )

    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        to=CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name="kanban_created_%(class)s",
        verbose_name="Создал",
    )
    updated_by = models.ForeignKey(
        to=CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name="kanban_updated_%(class)s",
        verbose_name="Обновил",
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        abstract = True


class KanbanTODO(KanbanTask):
    class Meta:
        verbose_name = "Запланированная задача"
        verbose_name_plural = "Запланированные задачи"


class KanbanINPROGRESS(KanbanTask):
    class Meta:
        verbose_name = "Задача в работе"
        verbose_name_plural = "Задачи в работе"


class KanbanDONE(KanbanTask):
    class Meta:
        verbose_name = "Задача выполнена"
        verbose_name_plural = "Задачи выполнены"
