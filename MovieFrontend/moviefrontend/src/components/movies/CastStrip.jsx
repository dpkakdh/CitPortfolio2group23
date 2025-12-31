import React from "react";

export default function CastStrip({ cast = [] }) {
  if (!cast.length) {
    return <div className="text-slate-400 text-sm">No cast available yet.</div>;
  }

  return (
    <div className="mt-3">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cast.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/30 p-3"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-800">
              {c.avatarUrl ? (
                <img
                  src={c.avatarUrl}
                  alt={c.name}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-slate-400 text-sm">
                  No image
                </div>
              )}
            </div>

            <div className="mt-2">
              <div className="font-semibold text-sm line-clamp-1">{c.name}</div>
              <div className="text-xs text-slate-400 line-clamp-1">
                {c.character ? `as ${c.character}` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}