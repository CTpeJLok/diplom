from django.contrib import admin

from .models import CodeEmail, CodeRecovery


@admin.register(CodeEmail, CodeRecovery)
class CodeAdmin(admin.ModelAdmin):
    list_per_page = 10
    list_display = [
        "user",
        "created",
        "is_active",
    ]
    raw_id_fields = [
        "user",
    ]
    list_filter = [
        ["is_active", admin.BooleanFieldListFilter],
    ]
