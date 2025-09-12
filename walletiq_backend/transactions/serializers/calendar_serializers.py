from rest_framework import serializers


class CalendarDayBadgesSerializer(serializers.Serializer):
    date = serializers.DateField(format="%Y-%m-%d", read_only=True)
    total_income = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    total_expense = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    net_balance = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
