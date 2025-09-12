import { useState, useEffect } from "react";
import {
  getTransactions,
  deleteTransaction,
} from "../../services/transactionsApi";
import { toast } from "react-toastify";

export const UseTransactionHandlers = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransactionDetails, setEditingTransactionDetails] =
    useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

  const fetchTransactions = async () => {
    setIsTransactionsLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.err || "Something went wrong!. Try Again";
      toast.error(errorMsg);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  const handleEdit = (item) => {
    setEditingTransactionDetails(item);
    setShowForm(true);
  };
  const handleSuccess = () => {
    fetchTransactions();
  };
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  return {
    transactions,
    fetchTransactions,
    handleDelete,
    handleEdit,
    handleViewDetails,
    handleSuccess,
    editingTransactionDetails,
    setEditingTransactionDetails,
    selectedTransaction,
    setSelectedTransaction,
    isTransactionsLoading,
    setShowForm,
    showForm,
  };
};
