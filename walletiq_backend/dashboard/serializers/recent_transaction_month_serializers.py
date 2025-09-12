from rest_framework import serializers
from transactions.models import Transaction


class RecentTransactionsOfMonthSerializer(serializers.ModelSerializer):
    transaction_type = serializers.CharField(
        source='transaction_type.name', read_only=True)
    category = serializers.CharField(
        source='category.category_name', read_only=True)
    account = serializers.CharField(source='account.name', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type',  'amount',
                  'category', 'account', 'transaction_date']
