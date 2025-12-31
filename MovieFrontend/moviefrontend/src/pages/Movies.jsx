// src/pages/Movies.jsx
import React, { useEffect, useMemo, useState } from "react";
import MovieGrid from "../components/movies/MovieGrid";
import { getMovies } from "../api/moviesApi";
import { useAuth } from "../context/AuthContext";

function cleanNA(v) {
  if (v == null) return "";
  const s = String(v).trim();
  return !s || s.toUpperCase() === "N/A" ? "" : s;
}

function normalizeMovie(m) {
  const tconst = cleanNA(m?.tconst);
  const title = cleanNA(m?.title);
  const year = cleanNA(m?.year);
  const posterUrl = cleanNA(m?.posterUrl);
  const genreStr = cleanNA(m?.genre);
  const imdbRating = cleanNA(m?.imdbRating);
  const imdbVotes = cleanNA(m?.imdbVotes);
  const metascore = cleanNA(m?.metascore);
  const plot = cleanNA(m?.plot);

  return {
    id: tconst,
    tconst,
    title,
    year,
    posterUrl,
    overview: plot,
    genres: genreStr ? genreStr.split(",").map((g) => g.trim()).filter(Boolean) : [],
    imdbRating,
    imdbVotes,
    metascore,
  };
}

// Create a compact page list like: 1 ... 5 6 [7] 8 9 ... 20
function buildPageItems(current, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items = new Set([1, totalPages, current, current - 1, current + 1, current - 2, current + 2]);
  const pages = [...items].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < pages.length; i++) {
    out.push(pages[i]);
    if (i < pages.length - 1 && pages[i + 1] !== pages[i] + 1) out.push("…");
  }
  return out;
}

export default function Movies() {
  const { token } = useAuth();

  const LIMIT = 24;

  const [page, setPage] = useState(1); // 1-based
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const offset = (page - 1) * LIMIT;
  const canFetch = token !== undefined;

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await getMovies({ limit: LIMIT, offset, token });
        const list = Array.isArray(res?.results) ? res.results : [];

        if (!alive) return;
        setMovies(list.map(normalizeMovie));
        setTotal(Number(res?.total ?? 0));
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load movies.");
        setMovies([]);
        setTotal(0);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (canFetch) load();
    return () => {
      alive = false;
    };
  }, [offset, token, canFetch]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const pageItems = useMemo(() => buildPageItems(page, totalPages), [page, totalPages]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Browse Movies & TV Shows</h1>
        <p className="text-slate-400">Loaded from backend API.</p>

        {/* Pagination Top */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            className="rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-2 disabled:opacity-50"
            disabled={!hasPrev || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {pageItems.map((item, idx) =>
              item === "…" ? (
                <span key={`dots-${idx}`} className="px-2 text-slate-500">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  disabled={loading}
                  onClick={() => setPage(item)}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm",
                    item === page
                      ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                      : "border-slate-800 bg-slate-900/30 text-slate-200 hover:bg-slate-900/50",
                  ].join(" ")}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            className="rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-2 disabled:opacity-50"
            disabled={!hasNext || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>

          <span className="ml-auto text-sm text-slate-400">
            Page {page} / {totalPages} • {total} total
          </span>
        </div>

        {loading && <p className="mt-6 text-slate-400">Loading…</p>}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8">
            <MovieGrid movies={movies} />
          </div>
        )}

        {/* Pagination Bottom */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              className="rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-2 disabled:opacity-50"
              disabled={!hasPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Prev
            </button>

            {pageItems.map((item, idx) =>
              item === "…" ? (
                <span key={`dots-b-${idx}`} className="px-2 text-slate-500">
                  …
                </span>
              ) : (
                <button
                  key={`b-${item}`}
                  onClick={() => setPage(item)}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm",
                    item === page
                      ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                      : "border-slate-800 bg-slate-900/30 text-slate-200 hover:bg-slate-900/50",
                  ].join(" ")}
                >
                  {item}
                </button>
              )
            )}

            <button
              className="rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-2 disabled:opacity-50"
              disabled={!hasNext}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
