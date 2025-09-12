from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
import calendar
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.db.models import Sum, F
from transactions.models import Transaction, Accounts
from ..serializers import IncomeVsExpenseChartSerializer, ExpenseByCategoryChartSerializer, WeeklyExpenseChartSerializer, AccountBalancesChartSerializer


class IncomeVsExpenseChartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        month_data = []

        for i in range(5, -1, -1):
            month_start = (today - relativedelta(months=i)).replace(day=1)
            next_month_start = (
                month_start + relativedelta(months=1))

            total_income = Transaction.objects.filter(
                transaction_type_id=1,
                transaction_date__gte=month_start,
                transaction_date__lt=next_month_start,
                created_by=request.user
            ).aggregate(total=Sum("amount"))["total"] or 0

            total_expense = Transaction.objects.filter(
                transaction_type_id=2,
                transaction_date__gte=month_start,
                transaction_date__lt=next_month_start,
                created_by=request.user
            ).aggregate(total=Sum("amount"))["total"] or 0

            month_label = calendar.month_abbr[month_start.month]

            response_data = {
                "month_name": month_label,
                "total_income": total_income,
                "total_expense": total_expense,
            }

            month_data.append(response_data)

        serializer = IncomeVsExpenseChartSerializer(month_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExpenseByCategoryChartAPIView(APIView):
    def get(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        category_expenses = (Transaction.objects.filter(
            transaction_type_id=2,
            transaction_date__gte=start_of_month,
            transaction_date__lte=today,
            created_by=request.user
        )
            .values(category_name=F("category__category_name"))
            .annotate(total_expense=Sum("amount"))
        )

        serializer = ExpenseByCategoryChartSerializer(
            category_expenses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WeeklyExpenseChartAPIView(APIView):
    def get(self, request):
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        weekly_expenses = []

        for i in range(7):
            current_day = start_of_week + timedelta(days=i)

            total_expense = Transaction.objects.filter(
                transaction_type_id=2,
                transaction_date__date=current_day,
                created_by=request.user
            ).aggregate(total=Sum('amount'))['total'] or 0

            day_name = current_day.strftime('%a')

            weekly_expenses.append({
                "day_name": day_name,
                "total_expense": total_expense
            })

        serializer = WeeklyExpenseChartSerializer(weekly_expenses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AccountBalancesChartAPIView(APIView):
    def get(self, request):
        account_balances = Accounts.objects.filter(created_by=request.user)
        serializer = AccountBalancesChartSerializer(
            account_balances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
