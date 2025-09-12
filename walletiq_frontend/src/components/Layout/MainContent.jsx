import { Outlet, Navigate, useLocation } from "react-router-dom";

const MainContent = () => {
  const location = useLocation();
  return (
    <div
      className="main-content"
      style={{ width: "100%", height: "auto", overflowY: "auto" }}
    >
      {location.pathname === "/walletiq-app" ? (
        <Navigate to="dashboard" />
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default MainContent;
