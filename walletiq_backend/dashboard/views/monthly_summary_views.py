from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum
from transactions.models import Transaction, Accounts
from ..serializers import MonthlySummarySerializer


class MonthSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now()
        start_of_month = today.replace(day=1)

        transactions = Transaction.objects.filter(
            transaction_date__gte=start_of_month, transaction_date__lte=today, created_by=request.user)

        total_accounts_balance = Accounts.objects.filter(created_by=request.user).aggregate(total=Sum("amount"))[
            "total"] or 0

        total_monthly_income = sum(
            tx.amount for tx in transactions if tx.transaction_type_id == 1)
        total_monthly_expense = sum(
            tx.amount for tx in transactions if tx.transaction_type_id == 2)
        total_monthly_savings = total_monthly_income - total_monthly_expense
        monthly_savings_rate = (
            (total_monthly_savings * 100) / total_monthly_income if total_monthly_income != 0 else 0)

        response_data = {
            "total_accounts_balance": total_accounts_balance,
            "total_monthly_income": total_monthly_income,
            "total_monthly_expense": total_monthly_expense,
            "total_monthly_savings": total_monthly_savings,
            "monthly_savings_rate": round(monthly_savings_rate, 2),
        }

        serializer = MonthlySummarySerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
