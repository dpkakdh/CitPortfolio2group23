import apiClient from "./apiClient";

export async function searchTitles(query, page = 1) {
  const response = await apiClient.get("/api/search", {
    params: { query, page },
  });
  return response.data;
}
