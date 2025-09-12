import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import "../../styles/dashboard/DashboardChartsSection.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IncomeVsExpenseChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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
    if (data && data.length > 0) {
      const labels = data.map((item) =>
        item.month_name
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

      const income = data.map((item) => item.total_income);
      const expense = data.map((item) => item.total_expense);

      setChartData({
        labels,
        datasets: [
          {
            label: "Income",
            data: income,
            backgroundColor: "rgba(76, 175, 80, 0.7)",
          },
          {
            label: "Expenses",
            data: expense,
            backgroundColor: "rgba(244, 67, 54, 0.7)",
          },
        ],
      });
    } else {
      setChartData(null);
    }
  }, [data]);

  if (!chartData)
    return (
      <div className="chart-placeholder">
        <p>No data available.</p>
      </div>
    );

  return (
    <div className="dashboard-chart-container">
      <Bar options={options} data={chartData} height={300} width={500} />
    </div>
  );
};

export default IncomeVsExpenseChart;
