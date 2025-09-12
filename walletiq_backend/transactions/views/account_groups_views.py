from rest_framework import viewsets
from ..models import AccountGroups
from ..serializers import AccountGroupsSerializer
from rest_framework.permissions import IsAuthenticated

class AccountGroupsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountGroupsSerializer

    def get_queryset(self):
        return AccountGroups.objects.all().order_by("id")