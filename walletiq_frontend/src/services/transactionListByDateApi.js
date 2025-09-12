import API from "../services/baseURL/api";

export const getTransactionListByDate = (params = {}) =>
  API.get("/transactionListByDate/", { params });
