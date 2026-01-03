import apiClient from "./apiClient";

// GET /api/search?q=&page=&pageSize=
export async function searchTitles(q, page = 1, pageSize = 24) {
  const res = await apiClient.get("/api/search", { params: { q, page, pageSize } });
  return res.data; // { page, pageSize, total, items }
}
