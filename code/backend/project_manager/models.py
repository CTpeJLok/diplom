from typing import TYPE_CHECKING

from django.db import models
from user_manager.models import CustomUser

if TYPE_CHECKING:
    from note_manager.models import Note
    from task_manager.models import Task


class Project(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
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

    project_users: models.QuerySet["ProjectUser"]
    tasks: models.QuerySet["Task"]
    notes: models.QuerySet["Note"]

    def __str__(self) -> str:
        return f"{self.name}"

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        db_table = "project"


class ProjectUser(models.Model):
    ROLE_CREATOR = "creator"
    ROLE_ADMIN = "admin"

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
    role = models.CharField(
        max_length=100,
        default=ROLE_CREATOR,
        choices=(
            (ROLE_CREATOR, "Создатель"),
            (ROLE_ADMIN, "Администратор"),
        ),
        verbose_name="Роль",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата обновления",
    )

    invite_code = models.UUIDField(
        unique=True,
        null=True,
        blank=True,
        verbose_name="Код приглашения",
    )
    last_sent_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Последняя отправка приглашения",
    )

    def __str__(self) -> str:
        return f"{self.project} :: {self.user}"

    class Meta:
        verbose_name = "Участник проекта"
        verbose_name_plural = "Участники проекта"
        db_table = "project_user"
