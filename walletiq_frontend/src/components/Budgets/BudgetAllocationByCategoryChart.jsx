import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import "../../styles/budgets/BudgetChartsSection.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetAllocationByCategoryChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Budgets by Category",
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

      setChartData({
        labels,
        datasets: [
          {
            label: "Budget",
            data: budgets,
            backgroundColor: chartColors.slice(0, budgets.length),
            borderColor: "#fff",
            borderWidth: 2,
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
      <Pie options={options} data={chartData} height={300} width={500} />
    </div>
  );
};

export default BudgetAllocationByCategoryChart;
