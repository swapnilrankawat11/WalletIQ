import { useState, useEffect } from "react";
import { getTransfers, deleteTransfer } from "../../services/transfersApi";
import { toast } from "react-toastify";

export const UseTransferHandlers = () => {
  const [transfers, setTransfers] = useState([]);
  const [editingTransferDetails, setEditingTransferDetails] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isTransfersLoading, setIsTransfersLoading] = useState(false);

  const fetchTransfers = async () => {
    setIsTransfersLoading(true);
    try {
      const response = await getTransfers();
      setTransfers(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.err || "Something went wrong!. Try Again";
      toast.error(errorMsg);
    } finally {
      setIsTransfersLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTransfer(id);
      fetchTransfers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingTransferDetails(item);
    setShowForm(true);
  };

  const handleViewDetails = (item) => {
    setSelectedTransfer(item);
  };

  const handleSuccess = () => {
    fetchTransfers();
  };

  const handleCancel = () => {
    setEditingTransferDetails(null);
    setShowForm(false);
  };

  return {
    transfers,
    fetchTransfers,
    handleDelete,
    handleEdit,
    handleViewDetails,
    handleCancel,
    handleSuccess,
    editingTransferDetails,
    setEditingTransferDetails,
    selectedTransfer,
    setSelectedTransfer,
    showForm,
    setShowForm,
    isTransfersLoading,
  };
};
