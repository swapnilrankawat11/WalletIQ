from rest_framework import serializers


class MonthlySummarySerializer(serializers.Serializer):
    total_accounts_balance = serializers.FloatField(read_only=True)
    total_monthly_income = serializers.FloatField(read_only=True)
    total_monthly_expense = serializers.FloatField(read_only=True)
    total_monthly_savings = serializers.FloatField(read_only=True)
    monthly_savings_rate = serializers.FloatField(read_only=True)
