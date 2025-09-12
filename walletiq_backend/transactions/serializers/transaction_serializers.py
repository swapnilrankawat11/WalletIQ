from rest_framework import serializers
from transactions.serializers.accounts_serializers import AccountsSerializer
from ..models import Transaction, TransactionCategories, TransactionTypes, Accounts


class TransactionTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionTypes
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by',
                            'modified_by', 'modified_at',]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class TransactionCategoriesSerializer(serializers.ModelSerializer):
    category_type = TransactionTypesSerializer(read_only=True)
    category_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TransactionTypes.objects.all(),
        write_only=True,
        source='category_type'
    )

    class Meta:
        model = TransactionCategories
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by',
                            'modified_by', 'modified_at',]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)

    def validate_category_name(self, value):
        if value.strip().isdigit():
            raise serializers.ValidationError({"error":
                                               "Category name cannot be only numbers."})

        return value


class TransactionSerializer(serializers.ModelSerializer):
    account = AccountsSerializer(read_only=True)
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Accounts.objects.all(),
        write_only=True,
        source="account"
    )

    category = TransactionCategoriesSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=TransactionCategories.objects.all(),
        write_only=True,
        source='category'
    )

    transaction_type = TransactionTypesSerializer(read_only=True)
    transaction_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TransactionTypes.objects.all(),
        write_only=True,
        source='transaction_type'
    )

    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by',
                            'modified_by', 'modified_at',]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                {"error": "Amount must be positive."})
        return value

    def validate(self, data):
        category = data.get('category')
        transaction_type = data.get('transaction_type')

        if category.category_type != transaction_type:
            raise serializers.ValidationError({"error": "Selected category type does not match transaction type."}
                                              )
        return data
