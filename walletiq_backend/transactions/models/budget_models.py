from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from ..models import TransactionCategories

User = get_user_model()


class Budget(models.Model):
    category = models.ForeignKey(
        TransactionCategories, on_delete=models.CASCADE, related_name="budgets")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.CharField(max_length=255, blank=True, null=True)
    month = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)])
    year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="budget_created")
    modified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="budget_modified")

    def __str__(self):
        return f"{self.category.name} | {self.amount}"
