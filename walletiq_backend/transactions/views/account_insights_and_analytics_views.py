from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from django.db.models import Sum, Q, Count, F
from collections import defaultdict
from ..models import Transaction, Accounts, Transfer
from ..serializers import AccountInsightsAndAnalyticsSerializer
from ..services import *


class AccountInsightsAndAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, acc_id):
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if month and year:
            start_date = datetime(int(year), int(month), 1)
            end_month = int(month) % 12 + 1
            end_year = int(year) + (1 if end_month == 1 else 0)
            end_date = datetime(end_year, end_month, 1)
        else:
            start_date = None
            end_date = None

        def date_filter(queryset):
            if start_date and end_date:
                return queryset.filter(transaction_date__range=(start_date, end_date))
            return queryset

        transactions = date_filter(
            Transaction.objects.filter(account_id=acc_id, created_by=request.user))
        transfers = date_filter(Transfer.objects.filter(
            Q(from_account_id=acc_id) | Q(to_account_id=acc_id), created_by=request.user))

        # Account Detailed Summary Data
        deposits = withdrawals = net_balance = total_available_balance = transfer_sent = transfer_recieved = income = expense = 0

        income = transactions.filter(transaction_type__name="income").aggregate(
            total=Sum('amount'))['total'] or 0
        transfer_sent = transfers.filter(
            from_account_id=acc_id).aggregate(total=Sum('amount'))['total'] or 0

        expense = transactions.filter(transaction_type__name="expense").aggregate(
            total=Sum('amount'))['total'] or 0
        transfer_recieved = transfers.filter(
            to_account_id=acc_id).aggregate(total=Sum('amount'))['total'] or 0
        deposits = income + transfer_recieved
        withdrawals = expense + transfer_sent

        net_balance = deposits - withdrawals

        total_available_balance = Accounts.objects.get(
            id=acc_id, created_by=request.user).amount

        total_transactions_count = transactions.count()

        summary_data = {
            "deposits": deposits,
            "withdrawals": withdrawals,
            "net_balance": net_balance,
            "total_available_balance": total_available_balance,
            "total_transactions_count": total_transactions_count,
        }

        # Income vs Expense Chart Data
        income_expense_chart_data = {
            "total_income": deposits,
            "total_expense": withdrawals
        }

        # Expenses by Category Chart Data

        category_expenses = transactions.filter(transaction_type_id=2).values(
            category_name=F("category__category_name")).annotate(total=Sum('amount'))
        
        expenses_by_category_chart_data = [
            {"category_name": item["category_name"], "total_expense": item["total"]} for item in category_expenses
        ]

        # Transactions Over Time Chart Data
        transactions_over_time_chart_data = {
            "dates": [],
            "income_tx_count": [],
            "expense_tx_count": [],
        }

        income_map = transactions.filter(transaction_type__name='income').values(
            'transaction_date').annotate(incomeTxCount=Count('id'))
        expense_map = transactions.filter(transaction_type__name='expense').values(
            'transaction_date').annotate(expenseTxCount=Count('id'))

        date_data = defaultdict(lambda: {"income": 0, "expense": 0})

        for item in income_map:
            date_obj = item['transaction_date']
            date_str = date_obj.date().strftime('%Y-%m-%d')
            date_data[date_str]["income"] = item["incomeTxCount"]

        for item in expense_map:
            date_obj = item['transaction_date']
            date_str = date_obj.date().strftime('%Y-%m-%d')
            date_data[date_str]["expense"] = item["expenseTxCount"]

        sorted_dates = sorted(date_data.keys())

        for date_str in sorted_dates:
            transactions_over_time_chart_data["dates"].append(date_str)
            transactions_over_time_chart_data["income_tx_count"].append(
                date_data[date_str]["income"])
            transactions_over_time_chart_data["expense_tx_count"].append(
                date_data[date_str]["expense"])

        # Total Transfer In Our Chart Data
        total_transfers_chart_data = {
            "total_sent": transfer_sent,
            "total_recieved": transfer_recieved
        }

        response_data = {
            "account_summary": summary_data,
            "transactions": transactions.order_by("-transaction_date"),
            "transfers": transfers.order_by("-transaction_date"),
            "income_expense_chart_data": income_expense_chart_data,
            "expense_by_category_chart_data": expenses_by_category_chart_data,
            "transactions_over_time_chart_data": transactions_over_time_chart_data,
            "total_transfers_chart_data": total_transfers_chart_data,
        }

        serializer = AccountInsightsAndAnalyticsSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
