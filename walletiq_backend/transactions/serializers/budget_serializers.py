from rest_framework import serializers
from ..models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.category_name", read_only=True)
    spent = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    remaining = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    overspent = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'category', 'category_name', 'amount', 'spent', 'remaining', 'overspent',
                  'month', 'year', 'note', 'created_at', 'modified_at', 'created_by', 'modified_by',]
        read_only_fields = ['id',  'created_at',
                            'modified_at', 'created_by', 'modified_by',]

    def validate_category(self, value):
        if value.category_type.name.lower() != "expense":
            raise serializers.ValidationError({"error":
                                               "Budgets can only be created for expense type catgories."})
        return value

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)
