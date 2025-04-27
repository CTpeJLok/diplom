from rest_framework import serializers
from user_manager.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()

    def get_email(self, obj: CustomUser) -> str:
        return obj.username

    class Meta:
        model = CustomUser
        fields = ["pk", "email"]
