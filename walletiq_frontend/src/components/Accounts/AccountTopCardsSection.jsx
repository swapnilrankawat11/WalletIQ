import "../../styles/accounts/AccountTopCards.css";
import { FaCoins, FaFileInvoiceDollar, FaWallet } from "react-icons/fa";

const AccountTopCardsSection = ({ accountsSummaryData }) => {
  const cardDetails = [
    {
      label: "Total Assets",
      value: `₹ ${accountsSummaryData.total_assets.toLocaleString("en-IN")}`,
      color: "#4CAF50",
      icon: <FaCoins />,
    },
    {
      label: "Total Liabilities",
      value: `₹ ${accountsSummaryData.total_liabilities.toLocaleString(
        "en-IN"
      )}`,
      color: "#F44336",
      icon: <FaFileInvoiceDollar />,
    },
    {
      label: "Total",
      value: `₹ ${accountsSummaryData.total_balance.toLocaleString("en-IN")}`,
      color: "#2196F3",
      icon: <FaWallet />,
    },
  ];

  return (
    <div className="account-top-cards">
      {cardDetails.map((card, index) => (
        <div
          className="account-card"
          key={index}
          style={{ borderTop: `4px solid ${card.color}` }}
        >
          <div className="account-card-content">
            <div>
              <div className="account-card-label">{card.label}</div>
              <div className="account-card-value">{card.value}</div>
            </div>
            <div className="account-card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountTopCardsSection;
