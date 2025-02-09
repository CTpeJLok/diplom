from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_notes),
    path("create/", views.create_note),
    path("<int:note_pk>/update/", views.update_note),
]
