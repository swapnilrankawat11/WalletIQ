import API from "../services/baseURL/api";

export const getBudgetChartData = (params = {}) =>
  API.get("/budgetVsSpentChartData/", { params });
