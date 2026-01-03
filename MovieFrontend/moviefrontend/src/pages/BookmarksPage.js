import React, { useEffect, useState } from "react";
import { getBookmarks, removeTitleBookmark } from "../api/bookmarksApi";
import { getMovieById } from "../api/moviesApi";
import MovieGrid from "../components/movies/MovieGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function BookmarksPage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(p = page) {
    setLoading(true);
    setError("");
    try {
      const data = await getBookmarks(p, pageSize);
      setPage(data.page ?? p);
      setTotal(data.total ?? 0);

      const items = data.items ?? [];
      const titleIds = items.filter((x) => x.type === "title").map((x) => x.code);

      const details = await Promise.all(
        titleIds.map(async (tconst) => {
          const d = await getMovieById(tconst);
          return {
            id: d.tconst,
            tconst: d.tconst,
            title: d.title ?? d.primaryTitle ?? "Untitled",
            year: d.year ?? d.startYear ?? "",
            posterUrl: d.posterUrl ?? d.poster ?? "",
            genre: d.genre ?? "",
            plot: d.plot ?? "",
          };
        })
      );

      setMovies(details);
    } catch (err) {
      setError(err?.message || "Could not load bookmarks.");
      setMovies([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleRemove = async (tconst) => {
    try {
      await removeTitleBookmark(tconst);
      await load(page);
    } catch (err) {
      setError(err?.message || "Could not remove bookmark.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">My Bookmarked Titles</h2>

      {loading && <Loader />}
      <ErrorMessage message={error} />

      {!loading && !error && movies.length === 0 && <p className="mt-4">No bookmarks yet.</p>}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="mt-6">
            {/* Your MovieCard currently links to details; removal can be done from details page.
                If you want remove buttons in cards, tell me and I’ll patch MovieCard. */}
            <MovieGrid movies={movies} />
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              className="rounded-lg border border-slate-800 px-3 py-2 disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => load(page - 1)}
            >
              ← Prev
            </button>
            <div className="text-sm text-slate-300">
              Page {page} / {totalPages} • {total} bookmarks
            </div>
            <button
              className="rounded-lg border border-slate-800 px-3 py-2 disabled:opacity-50"
              disabled={page >= totalPages || loading}
              onClick={() => load(page + 1)}
            >
              Next →
            </button>
          </div>

          <div className="mt-6">
            {/* Optional quick remove list */}
            <h3 className="font-semibold">Quick remove</h3>
            <ul className="mt-2 space-y-2">
              {movies.map((m) => (
                <li key={m.tconst} className="flex items-center justify-between border-b border-white/10 py-2">
                  <span>{m.title}</span>
                  <button
                    className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
                    onClick={() => handleRemove(m.tconst)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
