import apiClient from "./apiClient";

export async function getUserRatings() {
  const response = await apiClient.get("/api/ratings");
  return response.data;
}

export async function rateTitle(titleId, ratingValue) {
  const response = await apiClient.post("/api/ratings", {
    titleId,
    ratingValue,
  });
  return response.data;
}

export async function updateRating(ratingId, ratingValue) {
  const response = await apiClient.put(`/api/ratings/${ratingId}`, {
    ratingValue,
  });
  return response.data;
}

export async function deleteRating(ratingId) {
  const response = await apiClient.delete(`/api/ratings/${ratingId}`);
  return response.data;
}
