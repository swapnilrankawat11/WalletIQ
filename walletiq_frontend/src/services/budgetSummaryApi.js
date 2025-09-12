import API from "../services/baseURL/api";

export const getBudgetSummaryData = (params = {}) =>
  API.get("/budgetSummary/", { params });
