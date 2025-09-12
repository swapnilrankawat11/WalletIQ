import { FaWallet, FaArrowUp, FaArrowDown, FaPercentage } from "react-icons/fa";
import "../../styles/dashboard/DashboardTopCards.css";

const DashboardTopCards = ({ monthlySummaryData }) => {
  const cardDetails = [
    {
      label: "Total Balance",
      value: `₹ ${monthlySummaryData.total_accounts_balance.toLocaleString(
        "en-IN"
      )}`,
      color: "#4CAF50",
      icon: <FaWallet />,
    },
    {
      label: "Monthly Income",
      value: `₹ ${monthlySummaryData.total_monthly_income.toLocaleString(
        "en-IN"
      )}`,
      color: "#2196F3",
      icon: <FaArrowUp />,
    },
    {
      label: "Monthly Expense",
      value: `₹ ${monthlySummaryData.total_monthly_expense.toLocaleString(
        "en-IN"
      )}`,
      color: "#F44336",
      icon: <FaArrowDown />,
    },
    {
      label: "Monthly Savings (Rate)",
      value: `₹ ${monthlySummaryData.total_monthly_savings.toLocaleString(
        "en-IN"
      )} (${monthlySummaryData.monthly_savings_rate.toLocaleString(
        "en-IN"
      )} %)`,
      color: "#FF9800",
      icon: <FaPercentage />,
    },
  ];

  return (
    <div className="dashboard-top-cards">
      {cardDetails.map((card, index) => (
        <div
          className="dashboard-card"
          key={index}
          style={{ borderTop: `4px solid ${card.color}` }}
        >
          <div className="dashboard-card-content">
            <div>
              <div className="dashboard-card-label">{card.label}</div>
              <div className="dashboard-card-value">{card.value}</div>
            </div>
            <div className="dashboard-card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTopCards;
