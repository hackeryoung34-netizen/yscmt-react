import axios from "axios";

// Production must use the same-origin /api proxy or an explicit VITE_API_URL.
// Keep localhost only for local development; never ship a localhost API URL.
const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = (
  configuredApiUrl ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000/api/" : "/api/")
).replace(/\/?$/, "/");

const APP_BASE_PATH = import.meta.env.BASE_URL || "/portal/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = `${APP_BASE_PATH}signin`;
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}token/refresh/`,
          { refresh }
        );
        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = `${APP_BASE_PATH}signin`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
