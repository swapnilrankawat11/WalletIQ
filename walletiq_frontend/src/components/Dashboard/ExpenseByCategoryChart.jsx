import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "../../styles/dashboard/DashboardChartsSection.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseByCategoryChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  const options = {
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
    if (data && data.length > 0) {
      const labels = data.map((item) =>
        item.category_name
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

      const expenses = data.map((item) => item.total_expense);
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
            label: "Expenses",
            data: expenses,
            backgroundColor: chartColors.slice(0, expenses.length),
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
    <div className="dashboard-chart-container">
      <Pie options={options} data={chartData} height={300} width={500} />
    </div>
  );
};

export default ExpenseByCategoryChart;
