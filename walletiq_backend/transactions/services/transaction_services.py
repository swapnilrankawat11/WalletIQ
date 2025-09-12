from ..models import Transaction
from django.db import transaction

INCOME = "income"
EXPENSE = "expense"


@transaction.atomic
def apply_transaction_balance(tx: Transaction) -> None:
    transaction_type = tx.transaction_type.name.lower()

    if transaction_type == INCOME:
        tx.account.amount += tx.amount
    if transaction_type == EXPENSE:
        tx.account.amount -= tx.amount

    tx.account.save()


@transaction.atomic
def revert_transaction_balance(tx: Transaction) -> None:
    transaction_type = tx.transaction_type.name.lower()

    if transaction_type == INCOME:
        tx.account.amount -= tx.amount
    if transaction_type == EXPENSE:
        tx.account.amount += tx.amount
        
    tx.account.save()


@transaction.atomic
def update_transaction_balance(old_tx: Transaction, new_tx: Transaction) -> None:
    revert_transaction_balance(old_tx)
    apply_transaction_balance(new_tx)