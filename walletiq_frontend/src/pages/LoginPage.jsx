import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/loginApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSession } from "../contexts/SessionContext";
import { useUser } from "../contexts/UserContext";
import { getUserProfileDetails } from "../services/userProfileDetails";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import "../styles/login/LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setSessionExpired } = useSession();
  const { setUserProfileData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  }, []);

  const fetchUserProfileData = async () => {
    try {
      const response = await getUserProfileDetails();
      setUserProfileData(response.data);
      localStorage.setItem("userProfileData", JSON.stringify(response.data));
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "Something went wrong! Try Again.";
      toast.error(errorMsg);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateFormData = () => {
    const errs = {};

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    }

    return errs;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await login(formData);
      const { refresh, access } = response.data;
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("accessToken", access);
      setSessionExpired(false);
      fetchUserProfileData();
      navigate("/walletiq-app");
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
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="app-logo">
          Wallet<span>IQ</span>
        </div>

        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            {errors.loginError && (
              <div className="login-error-container">
                {errors.loginError}
                <button
                  className="close-errors-btn"
                  type="button"
                  onClick={() => setErrors({ ...errors, loginError: "" })}
                >
                  ×
                </button>
              </div>
            )}

            <label>Email</label>
            <input
              autoFocus
              name="email"
              type="text"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
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

            <LoadingButton
              type="submit"
              variant="contained"
              className="login-btn"
              loading={isLoading}
              sx={{
                "& .MuiCircularProgress-root": {
                  color: "white",
                },
              }}
            >
              Log In
            </LoadingButton>

            <div className="login-footer">
              Don’t have an account? <Link to="/signup">Create Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
