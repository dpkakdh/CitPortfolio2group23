import apiClient from "./apiClient";

export async function getSearchHistory(page = 1, pageSize = 20) {
  const res = await apiClient.get("/api/history/search", { params: { page, pageSize } });
  return res.data; // { page, pageSize, total, items }
}

export async function getRatingHistory(page = 1, pageSize = 20) {
  const res = await apiClient.get("/api/history/ratings", { params: { page, pageSize } });
  return res.data;
}
