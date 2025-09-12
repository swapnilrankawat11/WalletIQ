from rest_framework import serializers
from ..models import Transfer


class TransferSerializer(serializers.ModelSerializer):
    from_account_name = serializers.CharField(
        source="from_account.name", read_only=True)
    to_account_name = serializers.CharField(
        source="to_account.name", read_only=True)
    transaction_type_name = serializers.CharField(
        source="transaction_type.name", read_only=True)

    class Meta:
        model = Transfer
        fields = [
            'id', 'transaction_type_name', 'amount', 'transaction_date',
            'from_account', 'from_account_name',
            'to_account', 'to_account_name',
            'note', 'created_at', 'modified_at', 'created_by', 'modified_by'
        ]
        read_only_fields = ['created_at',
                            'modified_at', 'created_by', 'modified_by']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                {"error": "Amount must be greater than 0."})
        return value

    def validate(self, data):
        from_acc = data.get('from_account')
        to_acc = data.get('to_account')

        if from_acc == to_acc:
            raise serializers.ValidationError(
                {"error": "Choose a different account to transfer fund."})

        return data
