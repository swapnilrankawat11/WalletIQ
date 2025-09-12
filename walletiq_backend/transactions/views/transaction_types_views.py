from rest_framework import viewsets
from ..models import TransactionTypes
from ..serializers import TransactionTypesSerializer

from rest_framework.permissions import IsAuthenticated
class TransactionTypesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionTypesSerializer

    def get_queryset(self):
        return TransactionTypes.objects.all().order_by('id')
