import API from "../services/baseURL/api";

export const getAccountsSummary = () => API.get("/accounts-summary/");
