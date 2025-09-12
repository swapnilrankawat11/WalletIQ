from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import TransactionCategories
from ..serializers import TransactionCategoriesSerializer


class TransactionCategoriesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionCategoriesSerializer

    def get_queryset(self):
        return TransactionCategories.objects.all().order_by('-category_type__name', 'category_name')
