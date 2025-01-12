from typing import TYPE_CHECKING

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password

from .apps import UserManagerConfig as AppConfig

if TYPE_CHECKING:
    from project_manager.models import ProjectUser
    from task_manager.models import Task


class CustomUserManager(UserManager):
    def _create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("The given username must be set")

        user = self.model(username=username, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.EmailField(
        "Email",
        unique=True,
    )
    password = models.CharField(
        "Пароль",
        max_length=128,
    )

    is_active = models.BooleanField(
        "Активен",
        default=True,
    )
    is_staff = models.BooleanField(
        "Доступ к админке",
        default=False,
    )
    is_superuser = models.BooleanField(
        "Суперпользователь",
        default=False,
    )
    is_verified = models.BooleanField(
        "Проверен",
        default=False,
    )

    date_joined = models.DateTimeField(
        "Дата регистрации",
        default=timezone.now,
    )
    last_login = models.DateTimeField(
        "Последний вход",
        default=None,
        null=True,
        blank=True,
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    groups = None
    user_permissions = None

    project_users: models.QuerySet["ProjectUser"]
    created_tasks: models.QuerySet["Task"]
    updated_tasks: models.QuerySet["Task"]

    def __str__(self):
        return f"{self.username}"

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    # Name in admin panel
    def get_short_name(self):
        return self.username
