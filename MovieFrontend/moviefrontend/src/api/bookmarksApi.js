import apiClient from "./apiClient";

// GET /api/bookmark?page=&pageSize=
export async function getBookmarks(page = 1, pageSize = 20) {
  const res = await apiClient.get("/api/bookmark", { params: { page, pageSize } });
  return res.data; // { page, pageSize, total, items }
}

// POST /api/bookmark/title/{tconst}
export async function addTitleBookmark(tconst) {
  const res = await apiClient.post(`/api/bookmark/title/${tconst}`);
  return res.data;
}

// DELETE /api/bookmark/title/{tconst}
export async function removeTitleBookmark(tconst) {
  const res = await apiClient.delete(`/api/bookmark/title/${tconst}`);
  return res.data;
}
