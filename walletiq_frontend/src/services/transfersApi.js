import API from "../services/baseURL/api";

export const getTransfers = () => API.get("/transfers/");
export const addTransfer = (data) => API.post("/transfers/", data);
export const updateTransfer = (id, data) => API.put(`/transfers/${id}/`, data);
export const deleteTransfer = (id) => API.delete(`/transfers/${id}/`);
