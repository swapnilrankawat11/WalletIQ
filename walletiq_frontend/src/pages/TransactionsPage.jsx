import { UseTransactionHandlers } from "../components//Handlers/UseTransactionHandlers";
import TransactionList from "../components//Transactions/TransactionList";
import AddEditTransactionModal from "../components//Transactions/AddEditTransactionModal";
import TransactionDetailsModal from "../components//Transactions/TransactionDetailsModal";
import "../styles/transactions/TransactionsPage.css";

const TransactionsPage = () => {
  const {
    transactions,
    handleDelete,
    handleEdit,
    handleViewDetails,
    handleSuccess,
    editingTransactionDetails,
    setEditingTransactionDetails,
    selectedTransaction,
    setSelectedTransaction,
    showForm,
    setShowForm,
    isTransactionsLoading,
  } = UseTransactionHandlers();

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h2>Manage Transactions</h2>
        <button
          className="add-transaction-button"
          onClick={() => {
            setEditingTransactionDetails(null);
            setShowForm(true);
          }}
        >
          + Add Transaction
        </button>
      </div>

      {showForm && (
        <AddEditTransactionModal
          editingTransactionDetails={editingTransactionDetails}
          onSuccess={handleSuccess}
          onCancel={() => {
            setEditingTransactionDetails(null);
            setShowForm(false);
          }}
        />
      )}

      <TransactionList
        transactions={transactions}
        loading={isTransactionsLoading}
        onEdit={(item) => {
          handleEdit(item);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
