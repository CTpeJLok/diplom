from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from . import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("user_manager.urls")),
    path("api/project/", include("project_manager.urls")),
    path("api/project/<int:project_id>/task/", include("task_manager.urls")),
    path("api/project/<int:project_id>/note/", include("note_manager.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
