import random

from django.db import models
from django.utils import timezone

from .apps import ConfirmManagerConfig as AppConfig

from user_manager.models import CustomUser


def get_random_code():
    code = [str(random.randint(0, 9)) for i in range(6)]
    code = "".join(code)
    return code


class Code(models.Model):
    user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        related_name="code_%(class)s",
        verbose_name="Пользователь",
    )

    code = models.CharField(
        "Код",
        max_length=6,
        default=get_random_code,
    )

    is_active = models.BooleanField(
        "Активен",
        default=True,
    )

    created = models.DateTimeField(
        "Дата создания",
        auto_now_add=True,
    )

    def __str__(self) -> str:
        return f"{self.user} - {self.is_active}"

    class Meta:
        abstract = True


class CodeEmail(Code):
    class Meta:
        verbose_name = "Код активации Email"
        verbose_name_plural = "Коды активации Email"
        ordering = [
            "created",
        ]


class CodeRecovery(Code):
    class Meta:
        verbose_name = "Код сброса пароля"
        verbose_name_plural = "Коды сброса пароля"
        ordering = [
            "created",
        ]
