from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_tasks),
    path("create/", views.create_task),
    path("delete/<int:task_id>/", views.delete_task),
    path("update/<int:task_id>/", views.update_task),
    path("kanban/", views.get_kanban_tasks),
]
