from rest_framework import serializers

from .models import Note, NoteBlock


class NoteBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteBlock
        fields = "__all__"


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"
