from django.db import models

from project_manager.models import Project
from user_manager.models import CustomUser


class Note(models.Model):
    name = models.CharField(max_length=100)
    project = models.ForeignKey(
        to=Project,
        on_delete=models.CASCADE,
        related_name="notes",
        verbose_name="Проект",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        to=CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_notes",
        verbose_name="Создал",
    )
    updated_by = models.ForeignKey(
        to=CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name="updated_notes",
        verbose_name="Обновил",
    )

    content = models.TextField(
        "Содержание",
        null=True,
    )

    def __str__(self):
        return f"{self.project} - {self.name}"

    class Meta:
        verbose_name = "Записка"
        verbose_name_plural = "Записки"
        ordering = ["created_at"]
