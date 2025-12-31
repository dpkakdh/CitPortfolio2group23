import React from "react";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  if (!movies?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-slate-300">
        No movies found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
