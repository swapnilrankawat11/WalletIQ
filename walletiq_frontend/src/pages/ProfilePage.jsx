import { useState } from "react";
import { getUserProfileDetails } from "../services/userProfileDetails";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/logoutApi";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditUserProfileModal from "../components/Profile/EditUserProfileModal";
import ChangeUserProfilePasswordModal from "../components/Profile/ChangeUserProfilePasswordModal";
import "../styles/profile/ProfilePage.css";

const ProfilePage = () => {
  const { userProfileData, setUserProfileData } = useUser();
  const [showEditUserProfileModal, setShowEditUserProfileModal] =
    useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutAlertDialog, setShowLogoutAlertDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  const fetchUserProfileData = async () => {
    try {
      const response = await getUserProfileDetails();
      setUserProfileData(response.data);
      localStorage.setItem("userProfile", JSON.stringify(response.data));
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logout(refreshToken);
    } catch (err) {
      console.log(err);
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoggingOut(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button
          className="edit-profile-btn"
          onClick={() => setShowEditUserProfileModal(true)}
        >
          Edit
        </button>
      </div>

      {showEditUserProfileModal && (
        <EditUserProfileModal
          data={userProfileData}
          onClose={() => {
            setShowEditUserProfileModal(false);
            fetchUserProfileData();
          }}
        />
      )}

      <div className="profile-details">
        <ul>
          <li>
            <strong>Username : </strong>
            {userProfileData.username}
          </li>
          <li>
            <strong>Email : </strong>
            {userProfileData.email}
          </li>
          <li>
            <strong>First Name : </strong>
            {userProfileData.first_name}
          </li>
          <li>
            <strong>Last Name : </strong>
            {userProfileData.last_name}
          </li>
          <li>
            <strong>Date of Birth : </strong>
            {userProfileData.date_of_birth &&
              new Date(userProfileData.date_of_birth).toLocaleDateString()}
          </li>
          <li>
            <strong>Phone Number : </strong>
            {userProfileData.phone_number}
          </li>
          <li>
            <strong>Country : </strong>
            {userProfileData.country}
          </li>
          <li>
            <strong>Last Login : </strong>
            {dayjs
              .utc(userProfileData.last_login)
              .local()
              .format("MMM D, YYYY - h:mm A")}
          </li>
          <li>
            <strong>Account Created : </strong>
            {dayjs
              .utc(userProfileData.created_at)
              .local()
              .format("MMM D, YYYY - h:mm A")}
          </li>
        </ul>
      </div>

      {showChangePasswordModal && (
        <ChangeUserProfilePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}

      <Dialog
        open={showLogoutAlertDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to log out of your account. Are you sure you want to
            continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            loading={isLoggingOut}
            variant="text"
            disabled={isLoggingOut}
            onClick={handleLogout}
            color="error"
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={() => setShowLogoutAlertDialog(false)}
            disabled={isLoggingOut}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <div className="profile-actions">
        <button
          className="change-password-btn"
          onClick={() => setShowChangePasswordModal(true)}
        >
          Change Password
        </button>
        <button
          className="log-out-btn"
          onClick={() => setShowLogoutAlertDialog(true)}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
