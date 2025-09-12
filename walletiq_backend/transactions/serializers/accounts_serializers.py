from rest_framework import serializers
from ..models import AccountGroups, Accounts


class AccountGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountGroups
        fields = '__all__'
        read_only_fields = ['created_at',
                            'modified_at', 'created_by', 'modified_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)

    def validate_name(self, value):
        if value.strip().isdigit():
            raise serializers.ValidationError({"error":
                                               "Account Group Name can't contain only numbers."})


class AccountsSerializer(serializers.ModelSerializer):
    group = AccountGroupsSerializer(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=AccountGroups.objects.all(),
        write_only=True,
        source="group"
    )

    class Meta:
        model = Accounts
        fields = '__all__'
        read_only_fields = ['created_at',
                            'modified_at', 'created_by', 'modified_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)

    def validate_name(self, value):
        if value.strip().isdigit():
            raise serializers.ValidationError({"error":
                                               "Account Name can't contain only numbers."})
        return value
