from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_tasks),
    path("create/", views.create_task),
    path("<int:task_id>/toggle/", views.toggle_task),
]
