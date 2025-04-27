from rest_framework import serializers
from task_manager.models import Task
from user_manager.serializers import UserSerializer

from .models import Project, ProjectUser


class ProjectSerializer(serializers.ModelSerializer):
    in_progress_tasks_count = serializers.SerializerMethodField()

    def get_in_progress_tasks_count(self, obj: Project):
        return obj.tasks.filter(stage=Task.STAGE_IN_PROGRESS).count()

    class Meta:
        model = Project
        fields = "__all__"


class ProjectUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    project = ProjectSerializer()

    class Meta:
        model = ProjectUser
        fields = "__all__"
