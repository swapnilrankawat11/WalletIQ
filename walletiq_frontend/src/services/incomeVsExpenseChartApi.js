import API from "../services/baseURL/api";

export const getIncomeVsExpenseChartData = () =>
  API.get("/incomeVsExpenseChart/");
