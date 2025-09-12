from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from transactions.models import Transaction
from ..serializers import RecentTransactionsOfMonthSerializer


class RecentTransactionsOfMonthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)

        recent_transactions = (Transaction.objects.filter(
            transaction_date__gte=start_of_month,
            transaction_date__lte=today,
            created_by=request.user
        )
            .order_by('-transaction_date')[:5])

        serializer = RecentTransactionsOfMonthSerializer(
            recent_transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
