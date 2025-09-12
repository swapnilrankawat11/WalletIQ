import { useState, useEffect } from "react";
import { getCalendarDaySummary } from "../../services/calendarDaySummaryApi";
import { UseTransactionHandlers } from "../Handlers/UseTransactionHandlers";
import { getTransactionListByDate } from "../../services/transactionListByDateApi";
import { CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import { deleteTransaction } from "../../services/transactionsApi";
import dayjs from "dayjs";
import CalendarDayTransactionSummaryCards from "./CalendarDayTransactionSummaryCards";
import TransactionList from "../Transactions/TransactionList";
import AddEditTransactionModal from "../Transactions/AddEditTransactionModal";
import TransactionDetailsModal from "../Transactions/TransactionDetailsModal";
import "../../styles/transactions/TransactionsPage.css";

const CalendarDayTransaction = ({ date }) => {
  const [calendarDaySummaryData, setCalendarDaySummaryData] = useState(null);
  const [transactionList, setTransactionList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

  const params = {
    date: dayjs(date).format("YYYY-MM-DD"),
  };

  const {
    handleEdit,
    handleViewDetails,
    setShowForm,
    showForm,
    editingTransactionDetails,
    selectedTransaction,
    setSelectedTransaction,
    setEditingTransactionDetails,
  } = UseTransactionHandlers();

  const fetchTransactionList = async () => {
    if (!date) return null;
    setIsTransactionsLoading(true);
    try {
      const response = await getTransactionListByDate(params);
      setTransactionList(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  const fetchDaySummary = async () => {
    if (!date) return null;
    try {
      const response = await getCalendarDaySummary(params);
      setCalendarDaySummaryData(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  const handleSuccess = () => {
    fetchDaySummary();
    fetchTransactionList();
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      handleSuccess();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        await fetchDaySummary();
        await fetchTransactionList();
      } catch (err) {
        const errorMsg =
          err?.response?.data?.error || "Something went wrong! Try Again.";
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [date]);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop="230px"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <div className="day-transactions-container" style={{ padding: "25px" }}>
      {calendarDaySummaryData && (
        <CalendarDayTransactionSummaryCards data={calendarDaySummaryData} />
      )}

      <div className="transactions-header">
        <h3>Manage Transactions</h3>
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
          calendarTxDate={date}
          disableDateField={true}
        />
      )}

      {transactionList && (
        <TransactionList
          transactions={transactionList}
          loading={isTransactionsLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default CalendarDayTransaction;
