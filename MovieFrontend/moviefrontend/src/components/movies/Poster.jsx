import React from "react";

export default function Poster({ src, alt }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-slate-800">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full grid place-items-center text-slate-400 text-sm">
          No poster
        </div>
      )}

      {/* Subtle gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
    </div>
  );
}
