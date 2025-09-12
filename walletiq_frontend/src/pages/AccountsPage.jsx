import { useEffect, useState } from "react";
import { getAccounts, deleteAccount } from "../services/accountsApi";
import { getAccountsSummary } from "../services/accountsSummaryApi";
import { toast } from "react-toastify";
import { CircularProgress, Box } from "@mui/material";
import AccountList from "../components//Accounts/AccountList";
import AccountDetailsModal from "../components//Accounts/AccountDetailsModal";
import AddEditAccountModal from "../components//Accounts/AddEditAccountModal";
import AccountTopCardsSection from "../components//Accounts/AccountTopCardsSection";
import AccountInsightsAndAnalyticsModal from "../components/Accounts/AccountInsightsAndAnalyticsModal";
import "../styles/accounts/AccountsPage.css";

const AccountsPage = () => {
  const [accountsSummary, setAccountsSummary] = useState(null);
  const [accountsSummaryLoading, setAccountsSummaryLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAccountDetails, setEditingAccountDetails] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);
  const [selectedAccountName, setSelectedAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await getAccounts();
      setAccounts(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsightsDialog = (id, name) => {
    setSelectedAccountId(id);
    setSelectedAccountName(name);
    setShowInsightsDialog(!showInsightsDialog);
  };

  const fetchAccountsSummary = async () => {
    setAccountsSummaryLoading(true);
    try {
      const response = await getAccountsSummary();
      setAccountsSummary(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setAccountsSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchAccountsSummary();
  }, []);

  const handleEdit = (item) => {
    setEditingAccountDetails(item);
    setShowModal(true);
  };

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
  };

  const handleDelete = async (id) => {
    await deleteAccount(id);
    fetchAccounts();
  };

  const handleSuccess = () => {
    fetchAccounts();
  };

  return (
    <div className="accounts-page">
      {accountsSummaryLoading ? (
        <Box display="flex" justifyContent="center" marginLeft="-22px">
          <CircularProgress />
        </Box>
      ) : (
        accountsSummary && (
          <AccountTopCardsSection accountsSummaryData={accountsSummary} />
        )
      )}

      <div className="accounts-header">
        <h2>Manage Accounts</h2>
        <button
          className="add-account-button"
          onClick={() => {
            setEditingAccountDetails(null);
            setShowModal(true);
          }}
        >
          + Add Account
        </button>
      </div>
      {showModal && (
        <AddEditAccountModal
          editingAccountDetails={editingAccountDetails}
          onSuccess={handleSuccess}
          onCancel={() => {
            setEditingAccountDetails(null);
            setShowModal(false);
          }}
        />
      )}

      <AccountList
        accounts={accounts}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onOpen={handleInsightsDialog}
      />

      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => {
            setSelectedAccount(null);
          }}
        />
      )}

      <AccountInsightsAndAnalyticsModal
        handleClose={handleInsightsDialog}
        isOpen={showInsightsDialog}
        accountId={selectedAccountId}
        accountName={selectedAccountName}
      />
    </div>
  );
};

export default AccountsPage;
