import { NavLink } from "react-router-dom";
import "../../styles/layout/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="dashboard">📊 Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="transactions">💰 Transactions</NavLink>
        </li>
        <li>
          <NavLink to="transfers">🔄 Transfers</NavLink>
        </li>
        <li>
          <NavLink to="categories">🏷️ Categories</NavLink>
        </li>
        <li>
          <NavLink to="accounts">🏦 Accounts</NavLink>
        </li>
        <li>
          <NavLink to="budgets">📁 Budgets</NavLink>
        </li>
        <li>
          <NavLink to="calendarView">📅 Calendar</NavLink>
        </li>
        <li>
          <NavLink to="profile">👤 Profile</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
