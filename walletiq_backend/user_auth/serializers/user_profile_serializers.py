from rest_framework import serializers
from ..models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(
        source='user.first_name')
    last_name = serializers.CharField(source="user.last_name")
    last_login = serializers.DateTimeField(
        source='user.last_login', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'first_name', 'last_name', 'email', 'last_login',
                  'phone_number', 'date_of_birth', 'country', 'created_at', 'created_by', 'modified_at', 'modified_by',]
        read_only_fields = [
            'created_at', 'created_by', 'modified_at', 'modified_by',]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        instance.phone_number = validated_data.get(
            'phone_number', instance.phone_number)
        instance.date_of_birth = validated_data.get(
            'date_of_birth', instance.date_of_birth)
        instance.country = validated_data.get('country', instance.country)

        instance.save()
        return instance

    def validate_phone_number(self, value):
        if value and (not value.isdigit() or len(value) != 10):
            raise serializers.ValidationError({"error":
                                               "Phone number must be 10 digits."})
        return value

    def validate_date_of_birth(self, value):
        from datetime import date
        if value and value > date.today():
            raise serializers.ValidationError(
                {"error": "DOB cannot be in the future."})
        return value
