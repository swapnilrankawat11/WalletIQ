from rest_framework import serializers


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        max_length=255, required=True, write_only=True)
    new_password = serializers.CharField(
        max_length=255, required=True, write_only=True)
    confirm_password = serializers.CharField(
        max_length=255, required=True, write_only=True)
