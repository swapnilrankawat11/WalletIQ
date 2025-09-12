from django.db import models
from transactions.models.account_models import Accounts
from django.contrib.auth import get_user_model

User = get_user_model()


class TransactionTypes(models.Model):
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transaction_type_created")
    modified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="transaction_type_modified")

    def __str__(self):
        return f"{self.name}"


class TransactionCategories(models.Model):

    category_name = models.CharField(max_length=50)
    category_type = models.ForeignKey(
        TransactionTypes, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transaction_category_created")
    modified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="transaction_category_modified")

    def __str__(self):
        return f"{self.category_name} ({self.category_type})"


class Transaction(models.Model):

    transaction_type = models.ForeignKey(
        TransactionTypes, on_delete=models.CASCADE)
    category = models.ForeignKey(
        TransactionCategories, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    note = models.CharField(max_length=255, blank=True, null=True)
    transaction_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transaction_created")
    modified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="transaction_modified")

    def __str__(self):
        return f"{self.transaction_type} | {self.category} | {self.amount}₹"
