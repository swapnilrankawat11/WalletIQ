from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AccountGroups(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE,  related_name="acc_group_created")
    modified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="acc_group_modified")

    def __str__(self):
        return f"{self.name}"


class Accounts(models.Model):
    group = models.ForeignKey(AccountGroups, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="account_created")
    modified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="account_modified")

    def __str__(self):
        return f"{self.name} | {self.group} | {self.amount}"
