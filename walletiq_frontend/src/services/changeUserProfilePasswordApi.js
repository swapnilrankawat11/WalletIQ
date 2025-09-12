import API from "../services/baseURL/api";

export const updatePassword = (formData) =>
  API.post("/changeUserProfilePassword/", formData);
