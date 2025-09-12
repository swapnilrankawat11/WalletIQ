from rest_framework import serializers
from transactions.models import Accounts


class IncomeVsExpenseChartSerializer(serializers.Serializer):
    month_name = serializers.CharField(max_length=3, read_only=True)
    total_income = serializers.FloatField(read_only=True)
    total_expense = serializers.FloatField(read_only=True)


class ExpenseByCategoryChartSerializer(serializers.Serializer):
    category_name = serializers.CharField(read_only=True)
    total_expense = serializers.FloatField(read_only=True)


class WeeklyExpenseChartSerializer(serializers.Serializer):
    day_name = serializers.CharField(read_only=True)
    total_expense = serializers.FloatField(read_only=True)


class AccountBalancesChartSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source="name", read_only=True)
    total_account_balance = serializers.FloatField(
        source="amount", read_only=True)

    class Meta:
        model = Accounts
        fields = ['account_name', 'total_account_balance']
