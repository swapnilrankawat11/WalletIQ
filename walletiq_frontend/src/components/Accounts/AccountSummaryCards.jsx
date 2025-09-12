import "../../styles/accounts/AccountSummaryCards.css";
import {
  FaPiggyBank,
  FaMoneyBillWave,
  FaBalanceScale,
  FaWallet,
  FaExchangeAlt,
} from "react-icons/fa";
const AccountSummaryCards = ({ accountSummary }) => {
  const cardDetails = [
    {
      label: "Deposit",
      value: `₹ ${accountSummary.deposits.toLocaleString("en-IN")}`,
      color: "#4CAF50",
      icon: <FaPiggyBank />,
    },
    {
      label: "Withdrawal",
      value: `₹ ${accountSummary.withdrawals.toLocaleString("en-IN")}`,
      color: "#E53935",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Net Balance",
      value: `₹ ${accountSummary.net_balance.toLocaleString("en-IN")}`,
      color: "#1976D2",
      icon: <FaBalanceScale />,
    },
    {
      label: "Total Available Balance",
      value: `₹ ${accountSummary.total_available_balance.toLocaleString(
        "en-IN"
      )}`,
      color: "#FFC107",
      icon: <FaWallet />,
    },
    {
      label: "No. Of Transactions",
      value: `${accountSummary.total_transactions_count}`,
      color: "#9C27B0",
      icon: <FaExchangeAlt />,
    },
  ];

  return (
    <div className="account-top-summary-cards">
      {cardDetails.map((card, index) => (
        <div
          className="account-summary-card"
          key={index}
          style={{ borderTop: `3px solid ${card.color}` }}
        >
          <div className="account-summary-card-content">
            <div>
              <div className="account-summary-card-label">{card.label}</div>
              <div className="account-summary-card-value">{card.value}</div>
            </div>
            <div
              className="account-summary-card-icon"
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

export default AccountSummaryCards;
