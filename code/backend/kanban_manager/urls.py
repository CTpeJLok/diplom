from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_kanban),
    path("create/", views.create_kanban),
    path("<int:task_id>/<int:type>/delete/", views.delete_kanban),
    path("<int:task_id>/<int:type>/move/", views.move_next),
]
