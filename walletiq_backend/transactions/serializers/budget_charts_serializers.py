from rest_framework import serializers


class BudgetVsSpentChartSerializer(serializers.Serializer):
    category_name = serializers.CharField(max_length=50, read_only=True)
    budget_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    spent_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
