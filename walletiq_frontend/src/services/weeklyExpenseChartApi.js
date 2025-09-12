import API from "../services/baseURL/api";

export const getWeeklyExpenseChartData = () => API.get("/weeklyExpenseChart/");
