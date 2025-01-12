from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_projects),
    path("<int:project_id>/", views.get_project),
    path("create/", views.create_project),
]
