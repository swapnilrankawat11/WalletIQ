import API from "../services/baseURL/api";

export const logout = (refreshToken) => API.post("/logout/", refreshToken);
