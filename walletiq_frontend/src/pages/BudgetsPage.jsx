import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getBudgetSummaryData } from "../services/budgetSummaryApi";
import { CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import { getBudgets, deleteBudget } from "../services/budgetsApi";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import BudgetTopCardsSection from "../components/Budgets/BudgetTopCardsSection";
import BudgetList from "../components/Budgets/BudgetList";
import AddEditBudgetModal from "../components/Budgets/AddEditBudgetModal";
import BudgetDetailsModal from "../components/Budgets/BudgetDetailsModal";
import BudgetChartsSection from "../components/Budgets/BudgetChartsSection";
import "../styles/budgets/BudgetsPage.css";

const BudgetsPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [budgets, setBudgets] = useState(null);
  const [budgetSummaryCardsData, setBudgetSummaryCardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBudgetDetails, setEditingBudgetDetails] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      if (selectedDate) {
        const date = dayjs(selectedDate);
        const queryParams = {
          month: date.month() + 1,
          year: date.year(),
        };

        const response = await getBudgets(queryParams);
        setBudgets(response.data);
        const summaryResponse = await getBudgetSummaryData(queryParams);
        setBudgetSummaryCardsData(summaryResponse.data);
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleEdit = (budgetData) => {
    setEditingBudgetDetails(budgetData);
    setShowModal(true);
  };

  const handleViewDetails = (budget) => {
    setSelectedBudget(budget);
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
    fetchBudgets();
  };

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="630px"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <div style={{ padding: "20px" }}>
      {budgetSummaryCardsData && (
        <BudgetTopCardsSection data={budgetSummaryCardsData} />
      )}

      <div
        className="filters"
        style={{
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
        </Box>
      </div>
      <div className="budgets-page">
        <div className="budgets-header">
          <h2>Manage Budgets</h2>
          <button
            className="add-budget-button"
            onClick={() => {
              setEditingBudgetDetails(null);
              setShowModal(true);
            }}
          >
            + Add Budget
          </button>
        </div>

        {showModal && (
          <AddEditBudgetModal
            budgetMonthYear={selectedDate}
            editingBudgetDetails={editingBudgetDetails}
            onCancel={() => {
              setEditingBudgetDetails(null);
              setShowModal(false);
              fetchBudgets();
            }}
          />
        )}

        {budgets && (
          <BudgetList
            budgets={budgets}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        )}

        {selectedBudget && (
          <BudgetDetailsModal
            budget={selectedBudget}
            onClose={() => {
              setSelectedBudget(null);
            }}
          />
        )}
      </div>
      {selectedDate && <BudgetChartsSection budgetMonthYear={selectedDate} />}
    </div>
  );
};

export default BudgetsPage;
