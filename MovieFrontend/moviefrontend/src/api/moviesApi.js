import apiClient from "./apiClient";

// Backend: GET /api/movies?limit=&offset=
export async function getMovies({ limit = 24, offset = 0 } = {}) {
  const res = await apiClient.get("/api/movies", { params: { limit, offset } });
  return res.data; // { total, limit, offset, results }
}

// Backend: GET /api/movies/{tconst}
export async function getMovieById(tconst) {
  const res = await apiClient.get(`/api/movies/${tconst}`);
  return res.data;
}
