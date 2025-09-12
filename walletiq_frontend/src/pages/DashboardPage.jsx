import { useState, useEffect } from "react";
import { getMonthlySummary } from "../services/monthlySummaryApi";
import { getRecentTransactions } from "../services/recentTransactionsMonthApi";
import { CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import DashboardTopCardsSection from "../components/Dashboard/DashboardTopCardsSection";
import DashboardChartsSection from "../components/Dashboard/DashboardChartsSection";
import RecentTransactions from "../components/Dashboard/RecentTransactions";

const DashboardPage = () => {
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState(null);
  const [monthlySummaryLoading, setMonthlySummaryLoading] = useState(false);
  const [recentTransactionsLoading, setRecentTransactionsLoading] =
    useState(false);

  const fetchMonthlySummaryData = async () => {
    setMonthlySummaryLoading(true);
    try {
      const response = await getMonthlySummary();
      setMonthlySummary(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setMonthlySummaryLoading(false);
    }
  };

  const fetchRecentTransactionsData = async () => {
    setRecentTransactionsLoading(true);
    try {
      const response = await getRecentTransactions();
      setRecentTransactions(response.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setRecentTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySummaryData();
    fetchRecentTransactionsData();
  }, []);

  return (
    <div style={{ padding: "25px" }}>
      {monthlySummaryLoading ? (
        <Box display="flex" justifyContent="center" marginLeft="-22px">
          <CircularProgress />
        </Box>
      ) : (
        monthlySummary && (
          <DashboardTopCardsSection monthlySummaryData={monthlySummary} />
        )
      )}

      <DashboardChartsSection />

      {recentTransactionsLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        recentTransactions && <RecentTransactions data={recentTransactions} />
      )}
    </div>
  );
};

export default DashboardPage;
