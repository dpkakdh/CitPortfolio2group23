import React, { useState } from "react";
import { Link } from "react-router-dom";



export default function MovieCard({ movie }) {
  console.log("🎬 MovieCard poster:", movie?.posterUrl);

  const [imgOk, setImgOk] = useState(true);

  const poster =
    imgOk && movie.posterUrl ? movie.posterUrl : "/no-poster.png"; // put in public/

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden hover:border-slate-600 transition"
    >
      <div className="aspect-[2/3] w-full bg-slate-900">
        <img
          src={poster}
          alt={movie.title}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
          onError={() => setImgOk(false)}
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <div className="font-semibold leading-tight line-clamp-2">
          {movie.title}
        </div>

        <div className="mt-1 text-sm text-slate-400">{movie.year}</div>

        {!!movie.genres?.length && (
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded-full border border-slate-700 bg-slate-950/40 px-2 py-0.5 text-[11px] text-slate-200"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
