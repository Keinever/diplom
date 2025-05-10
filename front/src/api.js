import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "http://localhost:8000";

const api = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL ? import.meta.env.BACKEND_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;