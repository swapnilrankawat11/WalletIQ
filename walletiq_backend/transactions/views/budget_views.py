from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from django.db.models import Sum
from ..models import Budget, Transaction
from ..serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetSerializer

    def get_queryset(self):
        queryset = Budget.objects.filter(created_by=self.request.user)
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if month and year:
            queryset = queryset.filter(month=month, year=year)

        return queryset

    def list(self, request, *args, **kwargs):
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not month or not year:
            return Response({"error": "Month and year are required."}, status=status.HTTP_400_BAD_REQUEST)

        budgets = self.get_queryset()
        start_date = datetime(int(year), int(month), 1)
        end_month = int(month) % 12 + 1
        end_year = int(year) + (1 if end_month == 1 else 0)
        end_date = datetime(end_year, end_month, 1)
        category_ids = budgets.values_list('category', flat=True)

        transactions_map = {
            item['category']: item['total']
            for item in Transaction.objects.filter(
                category__in=category_ids,
                category__category_type__name="expense",
                transaction_date__gte=start_date,
                transaction_date__lt=end_date
            ).values('category').annotate(total=Sum('amount'))
        }

        result = []
        for budget in budgets:
            spent = transactions_map.get(budget.category.id, 0)
            remaining = overspent = 0
            if budget.amount >= spent:
                remaining = budget.amount - spent
            else:
                overspent = spent - budget.amount
            data = BudgetSerializer(budget).data
            data['spent'] = spent
            data['remaining'] = remaining
            data['overspent'] = overspent
            result.append(data)

        return Response(result, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        category = request.data.get('category')
        month = request.data.get('month')
        year = request.data.get('year')

        if Budget.objects.filter(category=category, month=month, year=year, created_by=self.request.user).exists():
            raise ValidationError(
                {"error": "Budget for this category already exists for the given month and year."}
            )

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        category = request.data.get('category')
        month = request.data.get('month')
        year = request.data.get('year')
        instance = self.get_object()

        if Budget.objects.exclude(pk=instance.pk).filter(category=category, month=month, year=year, created_by=self.request.user).exists():
            raise ValidationError({"error":
                                   "Another budget already exists for this category, month and year."}
                                  )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
