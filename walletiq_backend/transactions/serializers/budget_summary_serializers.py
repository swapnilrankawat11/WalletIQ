from rest_framework import serializers


class BudgetSummarySerializer(serializers.Serializer):
    total_budget = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    total_spent = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    remaining = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    overspent = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
