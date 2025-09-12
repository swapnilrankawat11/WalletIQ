from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import datetime
from ..models import Budget, Transaction
from ..serializers import BudgetVsSpentChartSerializer


class BudgetVsSpentChartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not (month and year):
            return Response({"error": "Month and year are required"}, status=status.HTTP_400_BAD_REQUEST)

        start_date = datetime(int(year), int(month), 1)
        end_month = int(month) % 12 + 1
        end_year = int(year) + (1 if end_month == 1 else 0)
        end_date = datetime(end_year, end_month, 1)
        budgets = Budget.objects.filter(
            month=month, year=year, created_by=self.request.user)

        result_data = []

        for budget in budgets:
            category_name = budget.category.category_name
            budget_amount = budget.amount
            spent_amount = Transaction.objects.filter(category=budget.category, transaction_type__name="expense", transaction_date__range=(
                start_date, end_date), created_by=self.request.user).aggregate(total=Sum('amount'))['total'] or 0
            result_data.append({
                "category_name": category_name,
                "budget_amount": budget_amount,
                "spent_amount": spent_amount,
            })

        serializer = BudgetVsSpentChartSerializer(result_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
