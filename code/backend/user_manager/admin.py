from django.contrib import admin
from django.contrib.auth.models import Group

from .models import CustomUser

admin.site.unregister(Group)


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_per_page = 10
    list_display = [
        "username",
        "last_login",
        "is_superuser",
        "is_active",
        "is_verified",
    ]
    list_display_links = [
        "username",
    ]
    list_filter = [
        ["is_active", admin.BooleanFieldListFilter],
        ["is_verified", admin.BooleanFieldListFilter],
        ["is_superuser", admin.BooleanFieldListFilter],
    ]  # type: ignore
    list_editable = [
        "is_superuser",
        "is_active",
        "is_verified",
    ]
