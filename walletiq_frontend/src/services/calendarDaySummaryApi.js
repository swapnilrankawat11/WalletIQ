import API from "../services/baseURL/api";

export const getCalendarDaySummary = (params = {}) =>
  API.get("/calendarDaySummary/", { params });
