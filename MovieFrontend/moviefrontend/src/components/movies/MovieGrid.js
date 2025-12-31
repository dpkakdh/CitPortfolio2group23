import React from "react";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return <p>No movies found.</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
