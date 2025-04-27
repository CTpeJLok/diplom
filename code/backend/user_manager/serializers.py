from rest_framework import serializers
from user_manager.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["pk", "username"]
