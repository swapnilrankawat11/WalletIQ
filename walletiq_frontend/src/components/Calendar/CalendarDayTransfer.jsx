import { useEffect, useState } from "react";
import { getTransferListByDate } from "../../services/transferListByDateApi";
import { UseTransferHandlers } from "../Handlers/UseTransferHandlers";
import { toast } from "react-toastify";
import { deleteTransfer } from "../../services/transfersApi";
import dayjs from "dayjs";
import TransferList from "../Transfers/TransferList";
import TransferDetailsModal from "../Transfers/TransferDetailsModal";
import AddEditTransferModal from "../Transfers/AddEditTransferModal";
import "../../styles/transfers/TransfersPage.css";

const CalendarDayTransfer = ({ date }) => {
  const [transferList, setTransferList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransferList = async () => {
    if (!date) return null;
    try {
      setIsLoading(true);
      const params = {
        date: dayjs(date).format("YYYY-MM-DD"),
      };
      const response = await getTransferListByDate(params);
      setTransferList(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferList();
  }, [date]);

  const {
    handleEdit,
    handleViewDetails,
    handleCancel,
    showForm,
    setShowForm,
    editingTransferDetails,
    selectedTransfer,
    setSelectedTransfer,
    setEditingTransferDetails,
  } = UseTransferHandlers();

  const handleSuccess = () => {
    fetchTransferList();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransfer(id);
      handleSuccess();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="transfers-container" style={{ padding: "25px" }}>
      <div className="transfers-header">
        <h3 style={{ fontFamily: "Segoe UI, sans-serif" }}>Manage Transfers</h3>
        <button
          className="add-transfer-button"
          onClick={() => {
            setEditingTransferDetails(null);
            setShowForm(true);
          }}
        >
          + Make Transfer
        </button>
      </div>

      {showForm && (
        <AddEditTransferModal
          editingTransferDetails={editingTransferDetails}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          calendarTxDate={date}
          disableDateField={true}
        />
      )}

      {transferList && (
        <TransferList
          transfers={transferList}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}
      {selectedTransfer && (
        <TransferDetailsModal
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
        />
      )}
    </div>
  );
};

export default CalendarDayTransfer;
