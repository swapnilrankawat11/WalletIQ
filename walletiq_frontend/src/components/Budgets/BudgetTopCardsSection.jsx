import "../../styles/budgets/BudgetTopCards.css";
import {
  FaPiggyBank,
  FaMoneyBillWave,
  FaBalanceScale,
  FaExclamationTriangle,
} from "react-icons/fa";

const BudgetTopCardsSection = ({ data }) => {
  const cardDetails = [
    {
      label: "Total Budget",
      value: `₹ ${Number(data.total_budget).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: "#3F51B5",
      icon: <FaPiggyBank />,
    },
    {
      label: "Total Spent",
      value: `₹ ${Number(data.total_spent).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: "#E53935",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Remaining",
      value: `₹ ${Number(data.remaining).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: "#43A047",
      icon: <FaBalanceScale />,
    },
    {
      label: "Overspent",
      value: `₹ ${Number(data.overspent).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: "#D32F2F",
      icon: <FaExclamationTriangle />,
    },
  ];

  return (
    <div className="budget-top-cards">
      {cardDetails.map((card, index) => (
        <div
          className="budget-card"
          key={index}
          style={{ borderTop: `4px solid ${card.color}` }}
        >
          <div className="budget-card-content">
            <div>
              <div className="budget-card-label">{card.label}</div>
              <div className="budget-card-value">{card.value}</div>
            </div>
            <div className="budget-card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetTopCardsSection;
