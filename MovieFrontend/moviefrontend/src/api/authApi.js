import { apiFetch } from "./http";

export function registerUser(payload) {
  // Adjust path if your backend uses another route
  return apiFetch("/api/auth/register", { method: "POST", body: payload });
}

export function loginUser(payload) {
  return apiFetch("/api/auth/login", { method: "POST", body: payload });
}
