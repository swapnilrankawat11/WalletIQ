import API from "../services/baseURL/api";

export const getAccountInsightsAndAnalyticsData = (accId, params = {}) =>
  API.get(`/accountInsightsAndAnalytics/${accId}/`, { params });
