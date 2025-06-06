# Generated by Django 5.2 on 2025-04-26 21:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('project_manager', '0004_alter_project_created_at_alter_project_description_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Описание')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to='project_manager.project', verbose_name='Проект')),
            ],
            options={
                'verbose_name': 'Записка',
                'verbose_name_plural': 'Записки',
                'db_table': 'note',
            },
        ),
        migrations.CreateModel(
            name='NoteBlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('block_type', models.CharField(choices=[('TEXT', 'Текст'), ('IMAGE', 'Изображение')], default='TEXT', max_length=100, verbose_name='Тип блока')),
                ('text', models.TextField(blank=True, null=True, verbose_name='Текст')),
                ('image', models.ImageField(blank=True, null=True, upload_to='note_blocks/', verbose_name='Изображение')),
                ('order', models.PositiveIntegerField(default=1, verbose_name='Порядковый номер')),
                ('note', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocks', to='note_manager.note', verbose_name='Записка')),
            ],
            options={
                'verbose_name': 'Блок',
                'verbose_name_plural': 'Блоки',
                'db_table': 'note_block',
                'ordering': ['note', 'order'],
            },
        ),
    ]
