import { UseTransferHandlers } from "../components/Handlers/UseTransferHandlers";
import TransferList from "../components/Transfers/TransferList";
import TransferDetailsModal from "../components/Transfers/TransferDetailsModal";
import AddEditTransferModal from "../components/Transfers/AddEditTransferModal";
import "../styles/transfers/TransfersPage.css";

const TransfersPage = () => {
  const {
    transfers,
    handleDelete,
    handleEdit,
    handleViewDetails,
    handleSuccess,
    handleCancel,
    editingTransferDetails,
    setEditingTransferDetails,
    selectedTransfer,
    setSelectedTransfer,
    isTransfersLoading,
    showForm,
    setShowForm,
  } = UseTransferHandlers();

  return (
    <div className="transfers-page">
      <div className="transfers-header">
        <h2>Manage Funds Transfer</h2>
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
        />
      )}

      <TransferList
        transfers={transfers}
        loading={isTransfersLoading}
        onEdit={(item) => {
          handleEdit(item);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />

      {selectedTransfer && (
        <TransferDetailsModal
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
        />
      )}
    </div>
  );
};

export default TransfersPage;
