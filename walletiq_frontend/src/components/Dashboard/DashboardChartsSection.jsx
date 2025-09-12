import { useState, useEffect } from "react";
import { getIncomeVsExpenseChartData } from "../../services/incomeVsExpenseChartApi";
import { getExpenseByCategoryChartData } from "../../services/expenseByCategoryChartApi";
import { getWeeklyExpenseChartData } from "../../services/weeklyExpenseChartApi";
import { getTotalAccountBalancesChartData } from "../../services/totalAccountBalancesChartApi";
import { CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import IncomeVsExpenseChart from "./IncomeVsExpenseChart";
import ExpenseByCategoryChart from "./ExpenseByCategoryChart";
import WeeklyExpenseChart from "./WeeklyExpenseChart";
import AccountBalancesChart from "./AccountBalancesChart";
import "../../styles/dashboard/DashboardChartsSection.css";

const DashboardChartsSection = () => {
  const [incomeVsExpenseChartData, setIncomeVsExpenseChartData] =
    useState(null);

  const [expenseByCategoryChartData, setExpenseByCategoryChartData] =
    useState(null);

  const [weeklyExpenseChartData, setWeeklyExpenseChartData] = useState(null);

  const [totalAccountBalancesChartData, setTotalAccountBalancesChartData] =
    useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchChartsData = async () => {
    setIsLoading(true);
    try {
      const [incomeRes, categoryRes, weeklyRes, balancesRes] =
        await Promise.all([
          getIncomeVsExpenseChartData(),
          getExpenseByCategoryChartData(),
          getWeeklyExpenseChartData(),
          getTotalAccountBalancesChartData(),
        ]);

      setIncomeVsExpenseChartData(incomeRes.data);
      setExpenseByCategoryChartData(categoryRes.data);
      setWeeklyExpenseChartData(weeklyRes.data);
      setTotalAccountBalancesChartData(balancesRes.data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData();
  }, []);

  return (
    <div className="dashboard-charts-grid">
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          marginLeft="602px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <IncomeVsExpenseChart data={incomeVsExpenseChartData} />
          <ExpenseByCategoryChart data={expenseByCategoryChartData} />
          <WeeklyExpenseChart data={weeklyExpenseChartData} />
          <AccountBalancesChart data={totalAccountBalancesChartData} />
        </>
      )}
    </div>
  );
};

export default DashboardChartsSection;
