from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.db.models import Sum
from ..models import Transaction
from ..serializers import CalendarDayBadgesSerializer


class CalendarDayBadgesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not (month and year):
            return Response({"error": "Month and year are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            month = int(month)
            year = int(year)
        except ValueError:
            return Response({"error": "Invalid month or year"}, status=status.HTTP_400_BAD_REQUEST)

        start_date = datetime(year, month, 1)
        end_month = month % 12 + 1
        end_year = year + (1 if end_month == 1 else 0)
        end_date = datetime(end_year, end_month, 1)

        result_data = []
        current_date = start_date
        transactions = Transaction.objects.filter(
            transaction_date__range=(start_date, end_date),
            created_by=request.user
        )

        while current_date < end_date:
            day = current_date.date()
            total_income = transactions.filter(
                transaction_type__name__iexact="income", transaction_date__date=day
            ).aggregate(total=Sum('amount'))['total'] or 0

            total_expense = transactions.filter(
                transaction_type__name__iexact="expense", transaction_date__date=day
            ).aggregate(total=Sum('amount'))['total'] or 0

            result_data.append({
                "date": day,
                "total_income": total_income,
                "total_expense": total_expense,
                "net_balance": total_income - total_expense,
            })

            current_date += timedelta(days=1)

        serializer = CalendarDayBadgesSerializer(result_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CalendarDaySummaryAPIView(APIView):
    def get(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        transactions = Transaction.objects.filter(
            transaction_date__date=date_obj,
            created_by=request.user
        )

        total_income = transactions.filter(
            transaction_type__name__iexact="income"
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_expense = transactions.filter(
            transaction_type__name__iexact="expense"
        ).aggregate(total=Sum('amount'))['total'] or 0

        net_balance = total_income - total_expense

        return Response([{
            "date": date_obj.strftime("%Y-%m-%d"),
            "total_income": total_income,
            "total_expense": total_expense,
            "net_balance": net_balance,
        }], status=status.HTTP_200_OK)
