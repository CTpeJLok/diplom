from django.db import models
from project_manager.models import Project


class Note(models.Model):
    project = models.ForeignKey(
        to=Project,
        on_delete=models.CASCADE,
        related_name="notes",
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

    blocks: models.QuerySet["NoteBlock"]

    def __str__(self):
        return f"{self.project} - {self.name}"

    class Meta:
        verbose_name = "Записка"
        verbose_name_plural = "Записки"
        db_table = "note"


class NoteBlock(models.Model):
    TYPE_TEXT = "TEXT"
    TYPE_IMAGE = "IMAGE"

    note = models.ForeignKey(
        to=Note,
        on_delete=models.CASCADE,
        related_name="blocks",
        verbose_name="Записка",
    )

    block_type = models.CharField(
        max_length=100,
        default=TYPE_TEXT,
        choices=(
            (TYPE_TEXT, "Текст"),
            (TYPE_IMAGE, "Изображение"),
        ),
        verbose_name="Тип блока",
    )

    text = models.TextField(
        null=True,
        blank=True,
        verbose_name="Текст",
    )

    image = models.ImageField(
        null=True,
        blank=True,
        upload_to="note_blocks/",
        verbose_name="Изображение",
    )

    order = models.PositiveIntegerField(
        default=1,
        verbose_name="Порядковый номер",
    )

    def __str__(self) -> str:
        return f"{self.note}"

    class Meta:
        verbose_name = "Блок"
        verbose_name_plural = "Блоки"
        ordering = ["note", "order"]
        db_table = "note_block"
