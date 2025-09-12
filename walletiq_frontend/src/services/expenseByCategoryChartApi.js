import API from "../services/baseURL/api";

export const getExpenseByCategoryChartData = () =>
  API.get("/expenseByCategoryChart/");
