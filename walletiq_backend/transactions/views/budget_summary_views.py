from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from ..models import Budget, Transaction
from ..serializers import BudgetSummarySerializer


class BudgetSummaryAPIView(APIView):
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
        category_ids = budgets.values_list('category', flat=True)

        total_budget = budgets.aggregate(total=Sum('amount'))['total'] or 0
        total_spent = Transaction.objects.filter(
            category__in=category_ids,
            category__category_type__name="expense",
            transaction_date__range=(start_date, end_date),
            created_by=self.request.user
        ).aggregate(total=Sum('amount'))['total'] or 0

        overspent = remaining = 0

        if total_budget >= total_spent:
            remaining = total_budget - total_spent
        else:
            overspent = total_spent - total_budget

        response_data = {
            "total_budget": total_budget,
            "total_spent": total_spent,
            "remaining": remaining,
            "overspent": overspent,
        }

        serializer = BudgetSummarySerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
