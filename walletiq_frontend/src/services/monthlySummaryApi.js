import API from "../services/baseURL/api";

export const getMonthlySummary = () => API.get("/monthly-summary/");
