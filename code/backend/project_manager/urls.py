from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_projects),
    path("<int:project_id>/", views.get_project),
    path("create/", views.create_project),
    path("<int:project_id>/team/", views.get_team),
    path("<int:project_id>/team/create/", views.create_team),
    path("<int:project_id>/team/first/<int:count>/", views.get_team),
    path("<int:project_id>/team/<int:team_id>/delete/", views.delete_team),
]
