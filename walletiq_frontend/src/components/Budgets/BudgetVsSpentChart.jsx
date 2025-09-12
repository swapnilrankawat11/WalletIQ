import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import "../../styles/budgets/BudgetChartsSection.css";

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

const BudgetVsSpentChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Budget vs Spent",
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
        item.category_name
          .toLowerCase()
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

      const budgets = data.map((item) => item.budget_amount);
      const spents = data.map((item) => item.spent_amount);

      setChartData({
        labels,
        datasets: [
          {
            label: "Budget",
            data: budgets,
            backgroundColor: "rgba(33, 150, 243, 0.7)",
          },
          {
            label: "Spent",
            data: spents,
            backgroundColor: "rgba(255, 87, 34, 0.7)",
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
    <div className="budget-chart-container">
      <Bar options={options} data={chartData} height={300} width={500} />
    </div>
  );
};

export default BudgetVsSpentChart;
