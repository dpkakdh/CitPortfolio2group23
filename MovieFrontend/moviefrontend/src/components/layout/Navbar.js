import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const [q, setQ] = useState("");

  const displayName = useMemo(() => {
    if (!token) return null;
    // Try common fields, fallback to email, fallback to generic
    return (
      user?.username ||
      user?.name ||
      user?.fullName ||
      user?.email ||
      "User"
    );
  }, [token, user]);

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-white/15 text-white"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    // Always route to /search with q param
    // If /search is protected, user will be redirected to login by your PrivateRoute.
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500" />
          <span className="text-lg font-semibold text-white">Cit23</span>
        </Link>

        {/* Always-visible search bar */}
        <form onSubmit={onSubmit} className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies…"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/15"
            >
              Search
            </button>
          </div>
        </form>

        {/* Nav links (only when logged in) */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          {token && (
            <>
              <NavLink to="/movies" className={navClass}>
                Movies
              </NavLink>
              <NavLink to="/search" className={navClass}>
                Search
              </NavLink>
              <NavLink to="/bookmarks" className={navClass}>
                Bookmarks
              </NavLink>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
              {/* If you added History route */}
              <NavLink to="/history" className={navClass}>
                History
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth section */}
        <div className="flex items-center gap-2 shrink-0">
          {token ? (
            <>
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="h-7 w-7 rounded-full bg-indigo-500/30 grid place-items-center text-xs font-semibold">
                  {String(displayName).slice(0, 1).toUpperCase()}
                </div>
                <div className="text-sm text-white/90 max-w-[140px] truncate">
                  {displayName}
                </div>
              </div>

              <button
                onClick={logout}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}