import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function HomePage() {
  const { token } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12">
      {/* glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          React Frontend • Clean Architecture • JWT Secure
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Movie & TV Rating Platform
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white/70">
          Search titles, bookmark favourites, and rate movies & TV shows. 
         {/* This frontend communicates
          with our ASP.NET Core backend and uses JWT authentication for protected features.*/}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {token ? (
            <>
              <Link
                to="/movies"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 font-semibold text-white hover:opacity-95"
              >
                Explore Movies
              </Link>
              <Link
                to="/search"
                className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15"
              >
                Search Titles
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 font-semibold text-white hover:opacity-95"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Feature title="Secure Access" text="JWT-based login protects user actions like bookmarks and ratings." />
          <Feature title="Layered Structure" text="UI components, logic, and API calls are separated for maintainability." />
          <Feature title="TMDB Integration" text="Fetch person images from TMDB to enrich the browsing experience." />
        </div>
      </div>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{text}</p>
    </div>
  );
}
