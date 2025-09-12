import API from "../services/baseURL/api";

export const getRecentTransactions = () => API.get("/recentTransactionsMonth/");
