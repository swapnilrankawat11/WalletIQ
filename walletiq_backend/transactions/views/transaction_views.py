from rest_framework import viewsets
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from ..models import Transaction
from ..serializers import TransactionSerializer
from ..services import *

class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(created_by=self.request.user).order_by('-transaction_date')

    def perform_create(self, serializer):
        tx = serializer.save()
        apply_transaction_balance(tx)

    def perform_update(self, serializer):
        old_tx = self.get_object()
        new_tx = serializer.save()
        update_transaction_balance(old_tx, new_tx)

    def perform_destroy(self, instance):
        revert_transaction_balance(instance)
        instance.delete()


class TransactionListByDateAPIView(APIView):
    def get(self, request):
        date_str = request.query_params.get('date')

        if not date_str:
            return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        transactions = Transaction.objects.filter(
            transaction_date__date=date_obj, created_by=request.user).order_by('-transaction_date')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
