import { NavLink } from "react-router-dom";
import { toTitleCase } from "../../utils/TextFormatter";
import "../../styles/dashboard/RecentTransactionsTable.css";
const RecentTransactions = ({ data }) => {
  return (
    <div className="recent-transactions-section">
      <h3>Recent Transactions</h3>
      <table className="recent-transactions-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6">No recent transactions</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{toTitleCase(item.transaction_type)}</td>
                <td>₹ {item.amount}</td>
                <td>{item.account}</td>
                <td>{toTitleCase(item.category)}</td>
                <td>{new Date(item.transaction_date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="view-all-btn-container">
        <NavLink to="/walletiq-app/transactions">
          <button type="button" className="view-all-btn">
            View All
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default RecentTransactions;
