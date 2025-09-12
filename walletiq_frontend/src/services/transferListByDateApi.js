import API from "../services/baseURL/api";

export const getTransferListByDate = (params = {}) =>
  API.get("/transferListByDate/", { params });
