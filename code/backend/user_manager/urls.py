from django.urls import path

from . import views

urlpatterns = [
    path("register/", views.register),
    path("login/", views.login),
    path("logout/", views.logout),
    path("refresh/", views.refresh),
    path("confirm/", views.check_code),
    path("recovery/", views.request_recovery),
]
