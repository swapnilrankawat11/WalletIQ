import API from "../services/baseURL/api";

export const getAccountGroups = () => API.get("/accountgroups/");
