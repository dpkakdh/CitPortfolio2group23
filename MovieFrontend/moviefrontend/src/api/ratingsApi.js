import apiClient from "./apiClient";

// POST /api/ratings  { tconst, value }
export async function rateTitle(tconst, value) {
  const res = await apiClient.post("/api/ratings", { tconst, value });
  return res.data;
}

// GET /api/ratings/my?page=&pageSize=
export async function getMyRatings(page = 1, pageSize = 20) {
  const res = await apiClient.get("/api/ratings/my", { params: { page, pageSize } });
  return res.data;
}

// DELETE /api/ratings/{tconst}
export async function deleteRating(tconst) {
  const res = await apiClient.delete(`/api/ratings/${tconst}`);
  return res.data;
}
