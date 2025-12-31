import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { token, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive ? "bg-white/15 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500" />
          <span className="text-lg font-semibold text-white">Cit23</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>Home</NavLink>
          {token && (
            <>
              <NavLink to="/movies" className={navClass}>Movies</NavLink>
              <NavLink to="/search" className={navClass}>Search</NavLink>
              <NavLink to="/bookmarks" className={navClass}>Bookmarks</NavLink>
              <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {token ? (
            <button
              onClick={logout}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
            >
              Logout
            </button>
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
