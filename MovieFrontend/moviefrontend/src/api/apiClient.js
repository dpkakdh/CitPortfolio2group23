import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
