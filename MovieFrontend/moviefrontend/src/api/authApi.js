import apiClient from "./apiClient";

export async function registerUser(payload) {
  const res = await apiClient.post("/api/auth/register", payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await apiClient.post("/api/auth/login", payload);
  return res.data; // expects { token, user? }
}
