from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ..models import UserProfile


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)


class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name',
                  'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {"error": "Passwords dont match"})

        if data['first_name'].strip().lower() == data['last_name'].strip().lower():
            raise serializers.ValidationError(
                {"error": "First name must not be equal to Last name"})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                {"error": "Email already registered."})
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data['email']
        # auto generate the dummy username - required in User model
        username = email.split('@')[0]
        user = User.objects.create_user(
            username=username, email=email, first_name=validated_data['first_name'], last_name=validated_data['last_name'], password=validated_data['password'])
        UserProfile.objects.create(created_by=user, user=user)
        return user
