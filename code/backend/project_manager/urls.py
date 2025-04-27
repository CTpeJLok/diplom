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
    path("<int:project_id>/invite/<uuid:invite_code>/accept/", views.accept_invite),
    path("<int:project_id>/invite/<uuid:invite_code>/reject/", views.reject_invite),
    path("<int:project_id>/invite/<uuid:invite_code>/resend/", views.resend_invite),
]
