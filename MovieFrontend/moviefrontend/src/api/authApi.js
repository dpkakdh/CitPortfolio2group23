import axios from "axios";
// import apiClient from "./apiClient";

const API_BASE = `${process.env.REACT_APP_API_BASE_URL}/api/Auth`;
const TOKEN_KEY = "token";

export const registerUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/register`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const loginUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/login`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

  export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
}

