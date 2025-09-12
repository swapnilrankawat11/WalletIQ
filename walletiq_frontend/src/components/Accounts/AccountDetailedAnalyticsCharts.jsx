import { Pie, Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import "../../styles/dashboard/DashboardChartsSection.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AccountDetailedAnalyticsCharts = ({
  incomeVsExpenseChartInfo,
  expenseByCategoryChartInfo,
  transactionsOverTimeChartInfo,
  totalTransfersChartInfo,
}) => {
  // -----------------------------INCOME VS EXPENSE CHART-------------------------------------- //
  const [incomeVsExpenseChartData, setIncomeVsExpenseChartData] =
    useState(null);

  const optionsForIncomeVsExpense = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Income vs Expenses",
        font: {
          size: 15,
          weight: "bold",
          family: "'Roboto', sans-serif",
        },
        color: "#333",
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    if (
      incomeVsExpenseChartInfo &&
      Object.keys(incomeVsExpenseChartInfo).length > 0
    ) {
      const labels = ["Income", "Expenses"];
      const income = incomeVsExpenseChartInfo.total_income;
      const expense = incomeVsExpenseChartInfo.total_expense;

      setIncomeVsExpenseChartData({
        labels,
        datasets: [
          {
            label: "Amount",
            data: [income, expense],
            backgroundColor: [
              "rgba(76, 175, 80, 0.7)",
              "rgba(244, 67, 54, 0.7)",
            ],
          },
        ],
      });
    } else {
      setIncomeVsExpenseChartData(null);
    }
  }, [incomeVsExpenseChartInfo]);

  // -----------------------------EXPENSE BY CATEGORY CHART-------------------------------------- //
  const [expensesByCategoryChartData, setExpensesByCategoryChartData] =
    useState(null);

  const optionsForExpenseByCategory = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expenses by Category",
        font: {
          size: 15,
          weight: "bold",
          family: "'Roboto', sans-serif",
        },
        color: "#333",
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    if (expenseByCategoryChartInfo && expenseByCategoryChartInfo.length >= 0) {
      const labels = expenseByCategoryChartInfo.map((item) =>
        item.category_name
          .toLowerCase()
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

      const expenses = expenseByCategoryChartInfo.map(
        (item) => item.total_expense
      );
      const chartColors = [
        "#FF6384", // red-pink
        "#36A2EB", // blue
        "#FFCE56", // yellow
        "#4CAF50", // green
        "#FF9800", // orange
        "#9C27B0", // purple
        "#00BCD4", // cyan
        "#E91E63", // deep pink
        "#8BC34A", // light green
        "#03A9F4", // sky blue
        "#795548", // brown
        "#607D8B", // blue-grey
      ];

      setExpensesByCategoryChartData({
        labels,
        datasets: [
          {
            label: "Expenses",
            data: expenses,
            backgroundColor: chartColors.slice(0, expenses.length),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      });
    } else {
      setExpensesByCategoryChartData(null);
    }
  }, [expenseByCategoryChartInfo]);

  // -----------------------------TRANSACTIONS OVER TIME CHART-------------------------------------- //

  const [transactionsOverTimeChartData, setTransactionsOverTimeChartData] =
    useState(null);

  const optionsForTransactionsOverTimeChart = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Transactions Count",
        font: {
          size: 15,
          weight: "bold",
          family: "'Roboto', sans-serif",
        },
        color: "#333",
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    if (
      transactionsOverTimeChartInfo &&
      Object.keys(transactionsOverTimeChartInfo).length > 0
    ) {
      const labels = transactionsOverTimeChartInfo.dates.map((item) => {
        const date = new Date(item);
        const options = { month: "short", day: "2-digit" };
        return date.toLocaleDateString("en-US", options);
      });

      setTransactionsOverTimeChartData({
        labels,
        datasets: [
          {
            label: "Income",
            data: transactionsOverTimeChartInfo.income_tx_count,
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.5)",
          },
          {
            label: "Expenses",
            data: transactionsOverTimeChartInfo.expense_tx_count,
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.5)",
          },
        ],
      });
    } else {
      setTransactionsOverTimeChartData(null);
    }
  }, [transactionsOverTimeChartInfo]);

  // -----------------------------TOTAL TRANSFER CHART-------------------------------------- //
  const [totalTransfersChartData, setTotalTransfersChartData] = useState(null);

  const optionsForTotalTransfer = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Transfers",
        font: {
          size: 15,
          weight: "bold",
          family: "'Roboto', sans-serif",
        },
        color: "#333",
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    if (
      totalTransfersChartInfo &&
      Object.keys(totalTransfersChartInfo).length > 0
    ) {
      const labels = ["Amount Sent", "Amount Received"];

      const data = [
        totalTransfersChartInfo.total_sent,
        totalTransfersChartInfo.total_recieved,
      ];
      const chartColors = [
        "#4CAF50", //recieved
        "#FF6384", //sent
      ];

      setTotalTransfersChartData({
        labels,
        datasets: [
          {
            label: "Amount",
            data,
            backgroundColor: chartColors.slice(0, data.length),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      });
    } else {
      setTotalTransfersChartData(null);
    }
  }, [totalTransfersChartInfo]);

  return (
    <div className="dashboard-charts-grid">
      <div className="dashboard-chart-container">
        {incomeVsExpenseChartData ? (
          <Bar
            options={optionsForIncomeVsExpense}
            data={incomeVsExpenseChartData}
            height={300}
            width={500}
          />
        ) : (
          <div className="chart-placeholder">
            <p>No data available.</p>
          </div>
        )}
      </div>
      <div className="dashboard-chart-container">
        {expensesByCategoryChartData ? (
          <Pie
            options={optionsForExpenseByCategory}
            data={expensesByCategoryChartData}
            height={300}
            width={500}
          />
        ) : (
          <div className="chart-placeholder">
            <p>No data available.</p>
          </div>
        )}
      </div>
      <div className="dashboard-chart-container">
        {transactionsOverTimeChartData ? (
          <Line
            options={optionsForTransactionsOverTimeChart}
            data={transactionsOverTimeChartData}
            height={300}
            width={500}
          />
        ) : (
          <div className="chart-placeholder">
            <p>No data available.</p>
          </div>
        )}
      </div>
      <div className="dashboard-chart-container">
        {totalTransfersChartData ? (
          <Pie
            options={optionsForTotalTransfer}
            data={totalTransfersChartData}
            height={300}
            width={500}
          />
        ) : (
          <div className="chart-placeholder">
            <p>No data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetailedAnalyticsCharts;
