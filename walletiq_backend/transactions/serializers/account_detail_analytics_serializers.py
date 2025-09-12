from rest_framework import serializers
from transactions.serializers.transaction_serializers import TransactionSerializer
from transactions.serializers.transfer_serializers import TransferSerializer


class AccountsSummarySerializer(serializers.Serializer):
    total_assets = serializers.FloatField(read_only=True)
    total_liabilities = serializers.FloatField(read_only=True)
    total_balance = serializers.FloatField(read_only=True)


class AccountDetailedSummarySerializer(serializers.Serializer):
    deposits = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    withdrawals = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    net_balance = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    total_available_balance = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    total_transactions_count = serializers.IntegerField(read_only=True)


class AccountIncomeExpenseChartDataSerializer(serializers.Serializer):
    total_income = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    total_expense = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)


class AccountExpenseByCategoryChartDataSerializer(serializers.Serializer):
    category_name = serializers.CharField(max_length=50, read_only=True)
    total_expense = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)


class AccountTotalTransfersChartDataChartSerializer(serializers.Serializer):
    total_sent = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    total_recieved = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)


class AccountTransactionsOverTimeChartDataSerializer(serializers.Serializer):
    dates = serializers.ListField(
        child=serializers.DateField(format='%Y-%m-%d'), read_only=True)
    income_tx_count = serializers.ListField(
        child=serializers.IntegerField(), read_only=True)
    expense_tx_count = serializers.ListField(
        child=serializers.IntegerField(), read_only=True)


class AccountInsightsAndAnalyticsSerializer(serializers.Serializer):
    account_summary = AccountDetailedSummarySerializer(read_only=True)
    transactions = TransactionSerializer(many=True, read_only=True)
    transfers = TransferSerializer(many=True, read_only=True)
    income_expense_chart_data = AccountIncomeExpenseChartDataSerializer(
        read_only=True)
    expense_by_category_chart_data = AccountExpenseByCategoryChartDataSerializer(
        many=True, read_only=True)
    transactions_over_time_chart_data = AccountTransactionsOverTimeChartDataSerializer(
        read_only=True)
    total_transfers_chart_data = AccountTotalTransfersChartDataChartSerializer(
        read_only=True)
