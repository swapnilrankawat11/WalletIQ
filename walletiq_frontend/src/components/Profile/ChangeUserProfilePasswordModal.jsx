import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { updatePassword } from "../../services/changeUserProfilePasswordApi";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/profile/ChangeUserProfilePasswordModal.css";
import "../../styles/common/AddEditModal.css";

const ChangeUserProfilePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[e.target.name];
      return updatedErrors;
    });
  };

  const validateFormData = () => {
    const errs = {};

    if (!formData?.current_password.trim()) {
      errs.current_password = "Current Password is required.";
    } else if (
      formData.current_password &&
      formData.current_password.length > 255
    ) {
      errs.current_password =
        "Current password can't be more than 255 characters";
    }

    if (!formData?.new_password.trim()) {
      errs.new_password = "New Password is required.";
    } else if (formData.new_password && formData.new_password.length < 6) {
      errs.new_password = "New Password must be at least 6 characters.";
    } else if (formData.new_password && formData.new_password.length > 255) {
      errs.new_password = "New Password can't be more than 255 characters.";
    }

    if (!formData?.confirm_password.trim()) {
      errs.confirm_password = "Confirm Password is required.";
    } else if (formData.new_password !== formData.confirm_password) {
      errs.confirm_password = "Passwords don't match.";
    } else if (
      formData.confirm_password &&
      formData.confirm_password.length > 255
    ) {
      errs.confirm_password =
        "Confirm Password can't be more than 255 characters.";
    }

    if (
      formData.current_password &&
      formData.new_password &&
      formData.confirm_password &&
      formData.current_password === formData.new_password &&
      formData.confirm_password === formData.new_password
    ) {
      errs.new_password =
        "New password must be different from the current password.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    const validationErrors = validateFormData();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setIsSubmitting(true);
      await updatePassword(formData);
      setErrors({});
      setAlertMessage("Password changed successfully.");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form
          className="change-password-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h3>Change Password</h3>
          {Object.keys(errors).length > 0 && (
            <div className="form-errors">
              <button
                className="close-errors-btn"
                type="button"
                onClick={() => setErrors({})}
              >
                ×
              </button>
              {Object.values(errors).map((err, i) =>
                err ? <p key={i}>{err}</p> : null
              )}
            </div>
          )}

          {alertMessage && (
            <div className="form-success-submit">
              {alertMessage}
              <button
                className="close-alert-btn"
                type="button"
                onClick={() => setAlertMessage("")}
              >
                ×
              </button>
            </div>
          )}

          <input
            type="text"
            name="username"
            style={{ display: "none" }}
            disabled
          />
          <input
            type="password"
            name="password"
            style={{ display: "none" }}
            disabled
          />

          <div className="password-input-container">
            <input
              autoFocus
              name="current_password"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={formData.current_password}
              onChange={handleChange}
              className={errors.current_password ? "error-input" : ""}
              autoComplete="off"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="password-input-container">
            <input
              name="new_password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              className={errors.new_password ? "error-input" : ""}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="password-input-container">
            <input
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={errors.confirm_password ? "error-input" : ""}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="change-password-form-buttons">
            <button
              className="save-button"
              type="submit"
              disabled={isSubmitting}
              style={{ minWidth: "50px" }}
            >
              {isSubmitting ? (
                <CircularProgress size={10} style={{ color: "white" }} />
              ) : (
                "Save"
              )}
            </button>

            <button className="close-button" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeUserProfilePasswordModal;
