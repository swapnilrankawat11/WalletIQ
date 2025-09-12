import API from "../services/baseURL/api";

export const getUserProfileDetails = () => API.get("/profile/");
export const updateUserProfileDetails = (formData) =>
  API.put("/profile/", formData);