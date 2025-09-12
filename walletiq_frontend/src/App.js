import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "./contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../src/services/logoutApi";
import { setSessionExpiryManager } from "./utils/SessionManager";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import AccountsPage from "./pages/AccountsPage";
import DashboardPage from "./pages/DashboardPage";
import TransfersPage from "./pages/TransfersPage";
import BudgetsPage from "./pages/BudgetsPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { sessionExpired, setSessionExpired } = useSession();
  const [showLogoutAlertDialog, setShowLogoutAlertDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (showError = true) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logout(refreshToken);
    } catch (err) {
      if (showError) {
        const errorMsg =
          err?.response?.data?.error || "Something went wrong! Try Again.";
        toast.error(errorMsg);
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (sessionExpired) {
      setShowLogoutAlertDialog(true);
      const timeout = setTimeout(() => {
        setShowLogoutAlertDialog(false);
        handleLogout(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [sessionExpired]);

  useEffect(() => {
    setSessionExpiryManager(setSessionExpired);
  }, [setSessionExpired]);

  return (
    <>
      <ToastContainer
        toastStyle={{
          minWidth: "350px",
          height: "50px",
        }}
        position="bottom-left"
        autoClose={5000}
        newestOnTop={true}
      />

      <Dialog
        open={showLogoutAlertDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You've Been Logged Out"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your session has expired due to inactivity or authentication
            timeout.
            <br />
            You will be redirected to the login page in 10 seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowLogoutAlertDialog(false);
              handleLogout();
            }}
            autoFocus
          >
            Login Again
          </Button>
        </DialogActions>
      </Dialog>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/walletiq-app" element={<HomePage />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="transfers" element={<TransfersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="calendarView" element={<CalendarPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
