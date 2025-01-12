from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/", include("user_manager.urls")),
    path("api/project/", include("project_manager.urls")),
    path("api/project/<int:project_id>/task/", include("task_manager.urls")),
    path("api/project/<int:project_id>/kanban/", include("kanban_manager.urls")),
]
