import { FaArrowUp, FaArrowDown, FaBalanceScale } from "react-icons/fa";
import "../../styles/calendar/CalendarDayTransactionSummaryCards.css";

const CalendarDayTransactionSummaryCards = ({ data }) => {
  const cardDetails = [
    {
      label: "Total Income",
      value: `₹ ${data[0].total_income.toLocaleString("en-IN")}`,
      color: "#4CAF50",
      icon: <FaArrowUp />,
    },
    {
      label: "Total Expense",
      value: `₹ ${data[0].total_expense.toLocaleString("en-IN")}`,
      color: "#F44336",
      icon: <FaArrowDown />,
    },
    {
      label: "Net Balance",
      value: `₹ ${data[0].net_balance.toLocaleString("en-IN")}`,
      color: data.net_balance >= 0 ? "#4CAF50" : "#F44336",
      icon: <FaBalanceScale />,
    },
  ];

  return (
    <div className="transaction-summary-day-top-cards">
      {cardDetails.map((card, index) => (
        <div
          className="transaction-summary-day-card"
          key={index}
          style={{ borderTop: `4px solid ${card.color}` }}
        >
          <div className="transaction-summary-day-card-content">
            <div>
              <div className="transaction-summary-day-card-label">
                {card.label}
              </div>
              <div className="transaction-summary-day-card-value">
                {card.value}
              </div>
            </div>
            <div
              className="transaction-summary-day-card-icon"
              style={{ color: card.color }}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarDayTransactionSummaryCards;
