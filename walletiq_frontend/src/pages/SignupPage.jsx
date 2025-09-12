import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signup } from "../services/signupApi";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import "../styles/signup/SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  useEffect(() => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  }, []);

  const validateFormData = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!formData.first_name.trim()) {
      errs.first_name = "First Name is required.";
    } else if (!nameRegex.test(formData.first_name)) {
      errs.first_name = "First Name can only contain letters and spaces.";
    } else if (formData.first_name.length > 255) {
      errs.first_name = "First Name cannot exceed 255 characters.";
    }

    if (!formData.last_name.trim()) {
      errs.last_name = "Last Name is required.";
    } else if (!nameRegex.test(formData.last_name)) {
      errs.last_name = "Last Name can only contain letters and spaces.";
    } else if (formData.last_name.length > 255) {
      errs.last_name = "Last Name cannot exceed 255 characters.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    } else if (formData.password.length > 255) {
      errs.password = "Password cannot exceed 255 characters.";
    }

    if (!formData.confirm_password) {
      errs.confirm_password = "Enter password again.";
    } else if (formData.confirm_password.length > 255) {
      errs.confirm_password = "Confirm Password cannot exceed 255 characters.";
    } else if (formData.password !== formData.confirm_password) {
      errs.confirm_password = "Passwords do not match.";
    }

    return errs;
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const response = await signup(formData);
      setSuccessMessage(response.data.message);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateFormData();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      handleSignup();
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="app-logo">
          Wallet<span>IQ</span>
        </div>

        <div className="signup-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="form-success-submit">
                {successMessage}
                <button
                  className="close-message-btn"
                  type="button"
                  onClick={() => setSuccessMessage("")}
                >
                  ×
                </button>
              </div>
            )}

            {errors.signupError && (
              <div className="signup-error-container">
                {errors.signupError}
                <button
                  className="close-errors-btn"
                  type="button"
                  onClick={() => setErrors({ ...errors, signupError: "" })}
                >
                  ×
                </button>
              </div>
            )}

            <label>First Name</label>
            <input
              autoFocus
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? "error-input" : ""}
            />
            {errors.first_name && (
              <p className="error-text">{errors.first_name}</p>
            )}

            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              value={formData.last_name}
              className={errors.last_name ? "error-input" : ""}
              onChange={handleChange}
            />
            {errors.last_name && (
              <p className="error-text">{errors.last_name}</p>
            )}

            <label>Email</label>
            <input
              type="text"
              placeholder="Enter email address"
              value={formData.email}
              className={errors.email ? "error-input" : ""}
              name="email"
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <label>Password</label>
            <div className="password-input-container">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}

            <label>Confirm Password</label>
            <div className="password-input-container">
              <input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
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
            {errors.confirm_password && (
              <p className="error-text">{errors.confirm_password}</p>
            )}

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              className="signup-btn"
            >
              Sign Up
            </LoadingButton>

            <div className="signup-footer">
              Already have an account? <Link to="/login">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
