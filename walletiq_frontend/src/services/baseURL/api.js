import axios from "axios";
import { triggerSessionExpiry } from "../../utils/SessionManager";

const API = axios.create({ baseURL: "http://127.0.0.1:8000/api" });

// REQUEST INTERCEPTOR → attach access token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// RESPONSE INTERCEPTOR → handle token expiry - auto refresh or log out on expiry
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response &&
      err.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken }
        );
        const { access: newAccessToken, refresh: newRefreshToken } = res.data; // set both bcz blacklist turned on
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        originalRequest.headers["Authorization"] = "Bearer " + res.data.access;
        return API(originalRequest);
      } catch (refreshErr) {
        triggerSessionExpiry();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);
export default API;
