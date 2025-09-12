import { useState, useEffect } from "react";
import { Box, ToggleButton, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Divider } from "@mui/material";
import { UseTransferHandlers } from "../Handlers/UseTransferHandlers";
import { UseTransactionHandlers } from "../Handlers/UseTransactionHandlers";
import { getAccountInsightsAndAnalyticsData } from "../../services/accountInsightsAndAnalyticsApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import TransactionList from "../Transactions/TransactionList";
import TransferList from "../Transfers/TransferList";
import AccountDetailedAnalyticsCharts from "./AccountDetailedAnalyticsCharts";
import AccountSummaryCards from "./AccountSummaryCards";
import AddEditTransactionModal from "../Transactions/AddEditTransactionModal";
import TransactionDetailsModal from "../Transactions/TransactionDetailsModal";
import TransferDetailsModal from "../Transfers/TransferDetailsModal";
import AddEditTransferModal from "../Transfers/AddEditTransferModal";
import "../../styles/transactions/TransactionsPage.css";
import "../../styles/transfers/TransfersPage.css";

const AccountInsightsAndAnalytics = ({ accountId }) => {
  const [accountInsightsAndAnalyticsData, setAccountInsightsAndAnalyticsData] =
    useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // null = all time
  const [viewAllTime, setViewAllTime] = useState(true); // true = all time
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleDelete: handleDeleteTransaction,
    handleEdit: handleEditTransaction,
    handleViewDetails: handleViewDetailsTransaction,
    handleSuccess: handleSuccessTransaction,
    setShowForm: setShowTransactionForm,
    showForm: showTransactionForm,
    editingTransactionDetails,
    selectedTransaction,
    setSelectedTransaction,
    setEditingTransactionDetails,
    isTransactionsLoading,
  } = UseTransactionHandlers();

  const {
    handleDelete: handleDeleteTransfer,
    handleEdit: handleEditTransfer,
    handleViewDetails: handleViewDetailsTransfer,
    handleSuccess: handleSuccessTransfer,
    handleCancel: handleCancelTransfer,
    showForm: showTransferForm,
    setShowForm: setShowTransferForm,
    editingTransferDetails,
    selectedTransfer,
    setSelectedTransfer,
    setEditingTransferDetails,
    isTransfersLoading,
  } = UseTransferHandlers();

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setViewAllTime(false);
  };

  const handleAllTimeClick = () => {
    setSelectedDate(null);
    setViewAllTime(true);
  };

  const fetchAccountInsightsAndAnalyticsData = async () => {
    setIsLoading(true);
    try {
      let params = {};
      if (selectedDate && !viewAllTime) {
        const date = dayjs(selectedDate);
        params = {
          month: date.month() + 1,
          year: date.year(),
        };
      }
      const response = await getAccountInsightsAndAnalyticsData(
        accountId,
        params
      );
      setAccountInsightsAndAnalyticsData(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "1Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountInsightsAndAnalyticsData();
  }, [accountId, selectedDate, viewAllTime]);

  if (isLoading || !accountInsightsAndAnalyticsData)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="700px"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <div>
      <div
        className="filters"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={["year", "month"]}
              label="Filter by Month & Year"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <ToggleButton
            value="allTime"
            selected={viewAllTime}
            onChange={handleAllTimeClick}
            sx={{
              border: "2px solid",
              borderColor: viewAllTime ? "blue" : "white",
            }}
          >
            All Time
          </ToggleButton>
        </Box>
      </div>

      <AccountSummaryCards
        accountSummary={accountInsightsAndAnalyticsData.account_summary}
      />

      <Divider sx={{ my: 2 }} />

      <div className="transactions-header">
        <h3>Manage Transactions</h3>
        <button
          className="add-transaction-button"
          onClick={() => {
            setEditingTransactionDetails(null);
            setShowTransactionForm(true);
          }}
        >
          + Add Transaction
        </button>
      </div>

      {showTransactionForm && (
        <AddEditTransactionModal
          editingTransactionDetails={editingTransactionDetails}
          onSuccess={() => {
            handleSuccessTransaction();
            fetchAccountInsightsAndAnalyticsData();
          }}
          onCancel={() => {
            setEditingTransactionDetails(null);
            setShowTransactionForm(false);
          }}
          currentAccountId={accountId}
          disableAccountField={true}
        />
      )}

      <TransactionList
        transactions={accountInsightsAndAnalyticsData.transactions}
        loading={isTransactionsLoading}
        onEdit={handleEditTransaction}
        onDelete={async (id) => {
          await handleDeleteTransaction(id);
          fetchAccountInsightsAndAnalyticsData();
        }}
        onViewDetails={handleViewDetailsTransaction}
      />

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      <Divider sx={{ mt: 6, mb: 2 }} />

      <div className="transfers-header">
        <h3>Manage Transfers</h3>
        <button
          className="add-transfer-button"
          onClick={() => {
            setEditingTransferDetails(null);
            setShowTransferForm(true);
          }}
        >
          + Make Transfer
        </button>
      </div>

      {showTransferForm && (
        <AddEditTransferModal
          editingTransferDetails={editingTransferDetails}
          onSuccess={() => {
            handleSuccessTransfer();
            fetchAccountInsightsAndAnalyticsData();
          }}
          onCancel={handleCancelTransfer}
          fromAccount={accountId}
          disableFromAccountField={true}
        />
      )}

      <TransferList
        transfers={accountInsightsAndAnalyticsData.transfers}
        loading={isTransfersLoading}
        onEdit={handleEditTransfer}
        onDelete={async (id) => {
          await handleDeleteTransfer(id);
          fetchAccountInsightsAndAnalyticsData();
        }}
        onViewDetails={handleViewDetailsTransfer}
      />

      {selectedTransfer && (
        <TransferDetailsModal
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
        />
      )}

      <Divider sx={{ mt: 6, mb: 4 }} />

      <h3>Analytics</h3>

      <AccountDetailedAnalyticsCharts
        incomeVsExpenseChartInfo={
          accountInsightsAndAnalyticsData.income_expense_chart_data
        }
        expenseByCategoryChartInfo={
          accountInsightsAndAnalyticsData.expense_by_category_chart_data
        }
        transactionsOverTimeChartInfo={
          accountInsightsAndAnalyticsData.transactions_over_time_chart_data
        }
        totalTransfersChartInfo={
          accountInsightsAndAnalyticsData.total_transfers_chart_data
        }
      />
    </div>
  );
};

export default AccountInsightsAndAnalytics;
