import API from "../services/baseURL/api";

export const getCalendarDayBadges = (params = {}) =>
  API.get("/calendarDayBadges/", { params });
