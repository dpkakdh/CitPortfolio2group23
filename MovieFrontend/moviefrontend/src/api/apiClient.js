import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const TOKEN_KEY = "token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
