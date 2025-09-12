import API from "../services/baseURL/api";

export const login = (formData) => API.post("/login/", formData);
