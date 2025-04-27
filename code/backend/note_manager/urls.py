from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_notes),
    path("create/", views.create_note),
    path("update/<int:note_id>/", views.update_note),
    path("delete/<int:note_id>/", views.delete_note),
    path("blocks/<int:note_id>/", views.get_note_blocks),
    path("blocks/<int:note_id>/create/", views.create_note_block),
    path("blocks/<int:note_id>/<int:note_block_id>/update/", views.update_note_block),
    path("blocks/<int:note_id>/<int:note_block_id>/delete/", views.delete_note_block),
    path(
        "blocks/<int:note_id>/<int:note_block_id>/order/<int:order>/",
        views.change_note_block_order,
    ),
]
