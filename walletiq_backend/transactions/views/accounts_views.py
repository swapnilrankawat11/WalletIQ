from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import Accounts
from ..serializers import AccountsSerializer

class AccountsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountsSerializer

    def get_queryset(self):
        return Accounts.objects.filter(created_by=self.request.user).order_by("id")
