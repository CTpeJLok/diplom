from django.db import models
from project_manager.models import Project


class Task(models.Model):
    STAGE_TODO = "TODO"
    STAGE_IN_PROGRESS = "IN_PROGRESS"
    STAGE_DONE = "DONE"

    project = models.ForeignKey(
        to=Project,
        on_delete=models.CASCADE,
        related_name="tasks",
        verbose_name="Проект",
    )

    name = models.CharField(
        max_length=100,
        verbose_name="Название",
    )
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name="Описание",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата обновления",
    )

    stage = models.CharField(
        max_length=100,
        default=STAGE_TODO,
        choices=(
            (STAGE_TODO, "TODO"),
            (STAGE_IN_PROGRESS, "IN_PROGRESS"),
            (STAGE_DONE, "DONE"),
        ),
        verbose_name="Статус",
    )
    stage_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True,
        verbose_name="Дата статуса",
    )

    is_show_in_kanban = models.BooleanField(
        default=True,
        verbose_name="Показывать в канбане",
    )

    def __str__(self):
        return f"{self.project} - {self.name}"

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"
        db_table = "task"
