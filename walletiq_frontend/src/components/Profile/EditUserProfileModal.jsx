import { useEffect, useState } from "react";
import { updateUserProfileDetails } from "../../services/userProfileDetails";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "../../styles/profile/EditUserProfileModal.css";
import "../../styles/common/AddEditModal.css";

const EditUserProfileModal = ({ data, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    country: "",
  });

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

  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "",
        email: data.email || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        date_of_birth: data.date_of_birth || "",
        phone_number: data.phone_number || "",
        country: data.country || "",
      });
    }
  }, [data]);

  const validateFormData = () => {
    const errs = {};

    if (!formData.username?.trim() || !formData.email?.trim()) {
      errs.apiError = "Something went wrong. Please refresh the page.";
    }

    if (!formData.first_name?.trim()) {
      errs.first_name = "First Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.first_name.trim())) {
      errs.first_name = "First Name should only contain letters and spaces.";
    }

    if (!formData.last_name?.trim()) {
      errs.last_name = "Last Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.last_name.trim())) {
      errs.last_name = "Last Name should only contain letters and spaces.";
    }

    if (!formData.date_of_birth) {
      errs.date_of_birth = "Date of Birth is required.";
    } else {
      const selectedDate = new Date(formData.date_of_birth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(selectedDate.getTime())) {
        errs.date_of_birth = "Date of Birth must be a valid date.";
      } else if (selectedDate >= today) {
        errs.date_of_birth = "Date of Birth cannot be today or a future date.";
      }
    }

    if (!formData.phone_number?.trim()) {
      errs.phone_number = "Phone Number is required.";
    } else if (!/^\d{10}$/.test(formData.phone_number.trim())) {
      errs.phone_number = "Phone Number must be exactly 10 digits.";
    }

    if (!formData.country?.trim()) {
      errs.country = "Country is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.country.trim())) {
      errs.country = "Country name should only contain letters and spaces.";
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

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        phone_number: formData.phone_number,
        country: formData.country,
      };
      await updateUserProfileDetails(payload);
      setAlertMessage("Updated Successfully.");
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
        <form className="edit-user-profile-form" onSubmit={handleSubmit}>
          <h3>Edit Profile</h3>

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
            value={formData.username}
            disabled
          />

          <input type="text" name="email" value={formData.email} disabled />

          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            className={errors.first_name ? "input-error" : ""}
          />

          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            className={errors.last_name ? "input-error" : ""}
          />

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={errors.date_of_birth ? "input-error" : ""}
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Enter your phone number"
            value={formData.phone_number}
            onChange={handleChange}
            className={errors.phone_number ? "input-error" : ""}
          />

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter your country name"
            className={errors.country ? "input-error" : ""}
          />

          <div className="edit-user-profile-form-buttons">
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

export default EditUserProfileModal;
