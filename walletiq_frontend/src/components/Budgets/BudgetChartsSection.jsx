import { useState, useEffect } from "react";
import { getBudgetChartData } from "../../services/budgetChartApi";
import { toast } from "react-toastify";
import { CircularProgress, Box } from "@mui/material";
import dayjs from "dayjs";
import BudgetVsSpentChart from "./BudgetVsSpentChart";
import BudgetAllocationByCategoryChart from "./BudgetAllocationByCategoryChart";
import "../../styles/budgets/BudgetChartsSection.css";

const BudgetChartsSection = ({ budgetMonthYear }) => {
  const [budgetVsSpentChartData, setBudgetVsSpentChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      if (budgetMonthYear) {
        let params = {};
        const date = dayjs(budgetMonthYear);
        params = {
          month: date.month() + 1,
          year: date.year(),
        };
        const response = await getBudgetChartData(params);
        setBudgetVsSpentChartData(response.data);
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
    fetchChartData();
  }, [budgetMonthYear]);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop="100px"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <div className="budget-charts-grid">
      <BudgetVsSpentChart data={budgetVsSpentChartData} />
      <BudgetAllocationByCategoryChart data={budgetVsSpentChartData} />
    </div>
  );
};

export default BudgetChartsSection;
