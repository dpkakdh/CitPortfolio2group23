import apiClient from "./apiClient";

export async function getDashboardData() {
  const response = await apiClient.get("/api/dashboard");
  return response.data; // whatever the DashboardController returns
}
