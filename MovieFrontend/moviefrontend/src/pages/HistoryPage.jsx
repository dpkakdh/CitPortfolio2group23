import React, { useEffect, useState } from "react";
import { getSearchHistory, getRatingHistory } from "../api/historyApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function HistoryPage() {
  const [tab, setTab] = useState("search");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (nextTab = tab, nextPage = page) => {
    setLoading(true);
    setError("");
    try {
      const res =
        nextTab === "ratings"
          ? await getRatingHistory(nextPage, pageSize)
          : await getSearchHistory(nextPage, pageSize);

      setTab(nextTab);
      setPage(res.page ?? nextPage);
      setData(res);
    } catch (err) {
      setError(err?.message || "Could not load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("search", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil((data.total ?? 0) / pageSize));

  return (
    <div>
      <h2 className="text-2xl font-bold">History</h2>

      <div className="mt-4 flex gap-2">
        <button
          className={`rounded-lg px-3 py-2 text-sm border ${tab === "search" ? "border-indigo-500" : "border-slate-800"}`}
          onClick={() => load("search", 1)}
        >
          Search history
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-sm border ${tab === "ratings" ? "border-indigo-500" : "border-slate-800"}`}
          onClick={() => load("ratings", 1)}
        >
          Rating history
        </button>
      </div>

      {loading && <Loader />}
      <ErrorMessage message={error} />

      {!loading && !error && (
        <>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
            {tab === "search" ? (
              <ul className="space-y-2">
                {(data.items ?? []).map((h) => (
                  <li key={h.id} className="flex justify-between border-b border-white/10 py-2">
                    <span>“{h.query}”</span>
                    <span className="text-sm text-slate-400">{h.resultsCount} results</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {(data.items ?? []).map((h) => (
                  <li key={h.id} className="flex justify-between border-b border-white/10 py-2">
                    <span>{h.tconst}</span>
                    <span className="text-sm text-slate-400">{h.value}/10</span>
                  </li>
                ))}
              </ul>
            )}

            {(data.items ?? []).length === 0 && <div className="text-slate-300">No history yet.</div>}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center gap-2">
              <button
                className="rounded-lg border border-slate-800 px-3 py-2 disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => load(tab, page - 1)}
              >
                ← Prev
              </button>
              <div className="text-sm text-slate-300">
                Page {page} / {totalPages} • {data.total ?? 0} total
              </div>
              <button
                className="rounded-lg border border-slate-800 px-3 py-2 disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => load(tab, page + 1)}
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
