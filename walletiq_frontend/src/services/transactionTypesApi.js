import API from "../services/baseURL/api";

export const getTransactionTypes = () => API.get("/transactiontypes/");
