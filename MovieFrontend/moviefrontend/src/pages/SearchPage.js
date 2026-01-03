import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieSearchBar from "../components/movies/MovieSearchBar";
import MovieGrid from "../components/movies/MovieGrid";
import { searchTitles } from "../api/searchApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = (searchParams.get("q") || "").trim();

  const [q, setQ] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const pageSize = 24;
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async (query, nextPage = 1) => {
    const cleaned = (query || "").trim();
    if (!cleaned) return;

    setLoading(true);
    setError("");
    try {
      // keep URL in sync
      setSearchParams({ q: cleaned, page: String(nextPage) });

      const data = await searchTitles(cleaned, nextPage, pageSize);
      setQ(cleaned);
      setPage(data.page ?? nextPage);
      setTotal(data.total ?? 0);
      setResults(data.items ?? []);
    } catch (err) {
      setError(err?.message || "Search failed.");
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when arriving from navbar search
  useEffect(() => {
    if (initialQ) {
      run(initialQ, Number(searchParams.get("page") || 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <h2 className="text-2xl font-bold">Search Titles</h2>

      <div className="mt-4">
        <MovieSearchBar onSearch={(query) => run(query, 1)} initialQuery={q} />
      </div>

      {loading && <Loader />}
      <ErrorMessage message={error} />

      {!loading && !error && (
        <>
          <div className="mt-6">
            <MovieGrid movies={results.map((m) => ({ ...m, id: m.tconst }))} />
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center gap-2">
              <button
                className="rounded-lg border border-slate-800 px-3 py-2 disabled:opacity-50"
                disabled={page <= 1 || loading}
                onClick={() => run(q, page - 1)}
              >
                ← Prev
              </button>

              <div className="text-sm text-slate-300">
                Page {page} / {totalPages} • {total} results
              </div>

              <button
                className="rounded-lg border border-slate-800 px-3 py-2 disabled:opacity-50"
                disabled={page >= totalPages || loading}
                onClick={() => run(q, page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}