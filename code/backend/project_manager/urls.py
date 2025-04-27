from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_projects),
    path("<int:project_id>/", views.get_project),
    path("create/", views.create_project),
    path("update/<int:project_id>/", views.update_project),
    path("delete/<int:project_id>/", views.delete_project),
    path("users/<int:project_id>/", views.get_project_users),
    path("invite/<int:project_id>/", views.create_send_invite),
    path(
        "invite/<int:project_id>/accept/<int:user_id>/<uuid:invite_code>/",
        views.accept_invite,
    ),
    path(
        "invite/<int:project_id>/reject/<int:user_id>/",
        views.reject_invite,
    ),
    path(
        "invite/<int:project_id>/resend/<int:user_id>/<uuid:invite_code>/",
        views.resend_invite,
    ),
]
