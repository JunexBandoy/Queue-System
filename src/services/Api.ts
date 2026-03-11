// services/Api.ts
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // adjust if needed

function getToken(): string | null {
  // MUST match your storage key in login(): localStorage.setItem("token", token)
  return localStorage.getItem("token");
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  // If using cookie-based auth (e.g., Sanctum with session cookies), enable this:
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Unauthorized: token missing/expired/invalid.");
      // Optionally: trigger a refresh flow or local logout here.
    }
    return Promise.reject(err);
  },
);
