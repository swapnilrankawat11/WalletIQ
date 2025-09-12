from ..models import Transfer
from django.db import transaction


@transaction.atomic
def apply_transfer_balance(tf: Transfer) -> None:
    tf.from_account.amount -= tf.amount
    tf.to_account.amount += tf.amount
    tf.from_account.save()
    tf.to_account.save()


@transaction.atomic
def revert_transfer_balance(tf: Transfer) -> None:
    tf.from_account.amount += tf.amount
    tf.to_account.amount -= tf.amount
    tf.from_account.save()
    tf.to_account.save()


@transaction.atomic
def update_transfer_balance(old_tf: Transfer, new_tf: Transfer) -> None:
    revert_transfer_balance(old_tf)
    apply_transfer_balance(new_tf)
