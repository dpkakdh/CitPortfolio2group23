import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-white/10 py-6">
        <div className="mx-auto max-w-6xl px-4 text-sm text-white/60">
          Portfolio Subproject 3 – Cit23 • Group Members- Deepika, Shabrin, Mads
        </div>
      </footer>
    </div>
  );
}
