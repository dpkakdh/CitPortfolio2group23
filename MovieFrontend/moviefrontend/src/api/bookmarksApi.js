import apiClient from "./apiClient";

export async function getBookmarks() {
  const response = await apiClient.get("/api/bookmarks");
  return response.data;
}

export async function addBookmark(titleId) {
  const response = await apiClient.post("/api/bookmarks", { titleId });
  return response.data;
}

export async function removeBookmark(titleId) {
  const response = await apiClient.delete(`/api/bookmarks/${titleId}`);
  return response.data;
}
