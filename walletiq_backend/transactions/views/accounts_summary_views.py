from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import Accounts
from ..serializers import AccountsSummarySerializer
from ..services import *
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated

class AccountsSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        total_assets = Accounts.objects.filter(
            amount__gt=0, created_by=request.user).aggregate(total=Sum("amount"))["total"] or 0
        total_liabilities = abs(Accounts.objects.filter(
            amount__lt=0, created_by=request.user).aggregate(total=Sum("amount"))["total"] or 0)
        total_balance = total_assets - total_liabilities

        accounts_summary = {
            "total_assets": round(total_assets, 2),
            "total_liabilities": round(total_liabilities, 2),
            "total_balance": round(total_balance, 2),
        }

        serializer = AccountsSummarySerializer(accounts_summary)
        return Response(serializer.data, status=status.HTTP_200_OK)
