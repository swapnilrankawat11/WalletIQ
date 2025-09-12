import API from "../services/baseURL/api";

export const signup = (formData) => API.post("/signup/", formData);
