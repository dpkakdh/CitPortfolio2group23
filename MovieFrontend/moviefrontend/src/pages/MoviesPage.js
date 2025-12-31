import React, { useEffect, useState } from "react";
import { getMovies } from "../api/moviesApi";
import MovieGrid from "../components/movies/MovieGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

export default function MoviesPage() {
  const { token } = useAuth();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      
      setLoading(true);
      setError("");
      try {
        const data = await getMovies({ token });
        // adjust depending on whether backend returns { items, totalCount } etc.

        const list = data?.data || data;
        setMovies(list || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

   return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Browse Titles</h1>
        <p className="text-slate-400">Loaded from backend API.</p>

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
      </div>
    </div>
  );
}

