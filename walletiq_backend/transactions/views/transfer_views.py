from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from ..models import Transfer
from ..serializers import TransferSerializer
from ..services import *


class TransferViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransferSerializer

    def get_queryset(self):
        return Transfer.objects.filter(created_by=self.request.user).order_by('-transaction_date')

    def perform_create(self, serializer):
        tf = serializer.save(created_by=self.request.user)
        apply_transfer_balance(tf)

    def perform_update(self, serializer):
        old_tf = self.get_object()
        new_tf = serializer.save(modified_by=self.request.user)
        update_transfer_balance(old_tf, new_tf)

    def perform_destroy(self, instance):
        revert_transfer_balance(instance)
        instance.delete()


class TransferListByDateAPIView(APIView):
    def get(self, request):
        date_str = request.query_params.get('date')
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

        if not (date_str and date_obj):
            return Response({"error": "Date is required"}, status=status.HTTP_200_OK)

        transfers = Transfer.objects.filter(
            transaction_date__date=date_obj, created_by=request.user).order_by('-transaction_date')
        serializer = TransferSerializer(transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
