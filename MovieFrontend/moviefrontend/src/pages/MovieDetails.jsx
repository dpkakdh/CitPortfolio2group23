import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Poster from "../components/movies/Poster";
import CastStrip from "../components/movies/CastStrip";
import { getMovieById, getMovies } from "../api/moviesApi";
import { addTitleBookmark, removeTitleBookmark, getBookmarks } from "../api/bookmarksApi";
import { rateTitle } from "../api/ratingsApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

function cleanNA(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s || s.toUpperCase() === "N/A") return null;
  return s;
}

export default function MovieDetails() {
  const { id } = useParams(); // tconst
  const [searchParams] = useSearchParams();
  const { token } = useAuth(); // only used to decide whether to fetch page list

  // read page from URL: /movies/:id?page=3
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const LIMIT = 24;
  const offset = (page - 1) * LIMIT;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // For prev/next within the current page
  const [pageMovies, setPageMovies] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  // New: bookmark/rating UI state
  const [uiError, setUiError] = useState("");
  const [uiBusy, setUiBusy] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [myRating, setMyRating] = useState(null); // number | null
  const [ratingInput, setRatingInput] = useState("");

  // Fetch details
  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setUiError("");

    getMovieById(id)
      .then((data) => {
        if (cancelled) return;
        setMovie(data);

        // Try to read bookmark/rating state if backend provides it
        // (Some endpoints return userRating / isBookmarked, some don't. We handle both.)
        const ur = data?.userRating ?? data?.rating ?? null;
        if (ur != null && !Number.isNaN(Number(ur))) {
          setMyRating(Number(ur));
          setRatingInput(String(Number(ur)));
        } else {
          setMyRating(null);
          setRatingInput("");
        }

        const b = data?.isBookmarked;
        if (typeof b === "boolean") setIsBookmarked(b);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Fetch the current list page so we can compute Prev/Next
  useEffect(() => {
    let alive = true;

    async function loadPageMovies() {
      try {
        if (!token) return;
        setPageLoading(true);

        const res = await getMovies({ limit: LIMIT, offset });
        const list = Array.isArray(res?.results) ? res.results : [];
        if (!alive) return;

        setPageMovies(
          list.map((m) => ({
            tconst: m.tconst,
            title: m.title,
          }))
        );
      } finally {
        if (alive) setPageLoading(false);
      }
    }

    loadPageMovies();
    return () => {
      alive = false;
    };
  }, [token, offset]);

  // New: if backend didn’t return bookmark state, check bookmarks list (cheap + paged)
  useEffect(() => {
    let alive = true;

    async function hydrateBookmarkState() {
      try {
        if (!token || !id) return;

        // If already known from movie response, don’t re-check
        if (typeof isBookmarked === "boolean" && isBookmarked) return;

        // Pull first few pages until found or exhausted a small cap
        // (Keeps it simple; bookmarks count usually small.)
        const MAX_PAGES = 3;
        for (let p = 1; p <= MAX_PAGES; p++) {
          const data = await getBookmarks(p, 50);
          const items = data?.items ?? [];
          const found = items.some((x) => x.type === "title" && x.code === id);
          if (!alive) return;
          if (found) {
            setIsBookmarked(true);
            return;
          }
          // If fewer than pageSize returned, no more pages
          if (items.length < 50) break;
        }
      } catch {
        // ignore; bookmark state can still be toggled manually
      }
    }

    hydrateBookmarkState();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const uiMovie = useMemo(() => {
    if (!movie) return null;

    const rating = cleanNA(movie.imdbRating);
    const votes = cleanNA(movie.imdbVotes);
    const metascore = cleanNA(movie.metascore);

    const castFromApi =
      Array.isArray(movie.castImages) && movie.castImages.length
        ? movie.castImages.map((c, idx) => ({
            id: c.tmdbId ?? `${movie.tconst}-${idx}`,
            name: (c.name || "").trim() || "Unknown",
            character: (c.character || "").trim(),
            avatarUrl: c.avatarUrl || "",
          }))
        : [];

    const castFromOmdb =
      cleanNA(movie.actors)
        ? movie.actors.split(",").map((name, idx) => ({
            id: `${movie.tconst}-${idx}`,
            name: name.trim(),
            character: "",
            avatarUrl: "",
          }))
        : [];

    const genres = cleanNA(movie.genre)
      ? movie.genre.split(",").map((x) => x.trim()).filter(Boolean)
      : [];

    return {
      id: movie.tconst,
      title: cleanNA(movie.title) || "Untitled",
      year: cleanNA(movie.year) || "—",
      posterUrl: cleanNA(movie.posterUrl) || "",
      overview: cleanNA(movie.plot) || "No plot available.",
      genres,
      rating: rating ?? "—",
      votes: votes ?? "—",
      metascore: metascore ?? null,
      cast: castFromApi.length ? castFromApi : castFromOmdb,
      director: cleanNA(movie.director),
      writer: cleanNA(movie.writer),
      type: cleanNA(movie.type),
    };
  }, [movie]);

  // Compute prev/next based on pageMovies
  const { prevItem, nextItem } = useMemo(() => {
    const idx = pageMovies.findIndex((m) => m.tconst === id);
    return {
      prevItem: idx > 0 ? pageMovies[idx - 1] : null,
      nextItem: idx >= 0 && idx < pageMovies.length - 1 ? pageMovies[idx + 1] : null,
    };
  }, [pageMovies, id]);

  async function toggleBookmark() {
    setUiError("");
    setUiBusy(true);
    try {
      if (!isBookmarked) {
        await addTitleBookmark(id);
        setIsBookmarked(true);
      } else {
        await removeTitleBookmark(id);
        setIsBookmarked(false);
      }
    } catch (e) {
      setUiError(e?.message || "Bookmark action failed.");
    } finally {
      setUiBusy(false);
    }
  }

  async function submitRating() {
    setUiError("");
    const v = Number(ratingInput);

    if (!Number.isFinite(v) || v < 1 || v > 10) {
      setUiError("Rating must be a number from 1 to 10.");
      return;
    }

    setUiBusy(true);
    try {
      await rateTitle(id, Math.round(v));
      setMyRating(Math.round(v));
    } catch (e) {
      setUiError(e?.message || "Rating failed.");
    } finally {
      setUiBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Loader />
          <Link to={`/movies?page=${page}`} className="text-indigo-400 hover:underline">
            ← Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  if (notFound || !uiMovie) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-slate-300">Movie not found.</p>
          <Link to={`/movies?page=${page}`} className="text-indigo-400 hover:underline">
            ← Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/movies?page=${page}`} className="text-indigo-400 hover:underline">
            ← Back to Movies
          </Link>

          <span className="text-sm text-slate-400">
            {pageLoading ? "Loading page…" : `Page ${page}`}
          </span>

          <div className="ml-auto flex gap-2">
            {prevItem ? (
              <Link
                to={`/movies/${prevItem.tconst}?page=${page}`}
                className="rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm hover:bg-slate-900/50"
                title={prevItem.title}
              >
                ← Prev
              </Link>
            ) : (
              <button
                disabled
                className="rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm opacity-50"
              >
                ← Prev
              </button>
            )}

            {nextItem ? (
              <Link
                to={`/movies/${nextItem.tconst}?page=${page}`}
                className="rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm hover:bg-slate-900/50"
                title={nextItem.title}
              >
                Next →
              </Link>
            ) : (
              <button
                disabled
                className="rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm opacity-50"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Poster */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
            <Poster src={uiMovie.posterUrl || "/no-poster.png"} alt={uiMovie.title} />

            {/* Actions */}
            <div className="mt-4 space-y-3">
              <button
                onClick={toggleBookmark}
                disabled={uiBusy}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-60"
              >
                {isBookmarked ? "★ Bookmarked (click to remove)" : "☆ Add to Bookmarks"}
              </button>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Your rating</div>
                  <div className="text-xs text-slate-400">{myRating ? `${myRating}/10` : "Not rated"}</div>
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={ratingInput}
                    onChange={(e) => setRatingInput(e.target.value)}
                    placeholder="1–10"
                    inputMode="numeric"
                    className="w-24 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={submitRating}
                    disabled={uiBusy}
                    className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
                  >
                    Save rating
                  </button>
                </div>
              </div>

              <ErrorMessage message={uiError} />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{uiMovie.title}</h1>
              <span className="text-slate-400">({uiMovie.year})</span>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-black/60 px-3 py-1 text-sm border border-white/10">
                  IMDb: {uiMovie.rating}
                </span>
                <span className="rounded-full bg-black/60 px-3 py-1 text-sm border border-white/10">
                  Votes: {uiMovie.votes}
                </span>
                {uiMovie.metascore && (
                  <span className="rounded-full bg-black/60 px-3 py-1 text-sm border border-white/10">
                    Metascore: {uiMovie.metascore}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-300 space-y-1">
              {uiMovie.type && (
                <div>
                  Type: <span className="text-slate-100">{uiMovie.type}</span>
                </div>
              )}
              {uiMovie.director && (
                <div>
                  Director: <span className="text-slate-100">{uiMovie.director}</span>
                </div>
              )}
              {uiMovie.writer && (
                <div>
                  Writer: <span className="text-slate-100">{uiMovie.writer}</span>
                </div>
              )}
            </div>

            {(uiMovie.genres || []).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {uiMovie.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 text-slate-200/90 leading-relaxed">{uiMovie.overview}</p>

            <div className="mt-8 min-w-0">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">Top Cast</h2>
                <span className="text-xs text-slate-400">
                  {uiMovie.cast?.length ? `${uiMovie.cast.length} shown` : "No cast"}
                </span>
              </div>

              <CastStrip cast={uiMovie.cast} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
