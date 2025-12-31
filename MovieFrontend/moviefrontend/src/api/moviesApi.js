// import { apiFetch } from "./http"; // (not used yet, but fine to keep)

const API_BASE = "https://localhost:7250";

export async function getMovies({ limit = 60, offset = 0, token } = {}) {
  const res = await fetch(
    `${API_BASE}/api/movies?limit=${limit}&offset=${offset}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!res.ok) throw new Error("Failed to load movies");
  return res.json(); // { results: [...] }
}

export async function searchMovies({ q, limit = 60, offset = 0, token } = {}) {
  const res = await fetch(
    `${API_BASE}/api/movies/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );

  if (!res.ok) throw new Error("Failed to search movies");
  return res.json(); // { results: [...] }
}

// ✅ ADD THIS (matches backend: GET /api/movies/{tconst})
export async function getMovieById(tconst, { token } = {}) {
  const res = await fetch(`${API_BASE}/api/movies/${tconst}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 404) throw new Error("Movie not found");
  if (!res.ok) throw new Error("Failed to load movie details");

  return res.json(); // movie object
}
