from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from transactions.models.account_models import Accounts
from transactions.models.transaction_models import TransactionTypes
from django.contrib.auth import get_user_model

User = get_user_model()


class Transfer(models.Model):

    transaction_type = models.ForeignKey(
        TransactionTypes, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField()
    from_account = models.ForeignKey(
        Accounts, on_delete=models.CASCADE, related_name="sent_transfer")
    to_account = models.ForeignKey(
        Accounts, on_delete=models.CASCADE, related_name="received_transfer")
    note = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transfer_created")
    modified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="transfer_modified")

    def __str__(self):
        return f"{self.from_account_id} to {self.to_account_id} - {self.amount}"

    def save(self, *args, **kwargs):
        if not self.transaction_type_id:
            try:
                self.transaction_type = TransactionTypes.objects.get(
                    name="transfer")
            except ObjectDoesNotExist:
                raise ValueError(
                    "Default transaction type 'Transfer' does not exist.")
        super().save(*args, **kwargs)
