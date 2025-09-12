import API from "../services/baseURL/api";

export const getTotalAccountBalancesChartData = () =>
  API.get("/totalAccountBalancesChart/");
