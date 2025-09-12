import API from "../services/baseURL/api";

export const getBudgets = (params = {}) => API.get("/budgets/", { params });
export const addBudget = (data, params = {}) =>
  API.post("/budgets/", data, params);
export const updateBudget = (id, data, params = {}) =>
  API.put(`/budgets/${id}/`, data, params);
export const deleteBudget = (id) => API.delete(`/budgets/${id}/`);
