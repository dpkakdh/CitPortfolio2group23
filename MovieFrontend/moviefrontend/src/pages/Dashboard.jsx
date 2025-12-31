import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            <div>
              <div className="text-sm text-slate-400">Cit23</div>
              <div className="font-semibold leading-tight">Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900">
              Notifications
            </button>
            <div className="h-9 w-9 rounded-full bg-slate-800 grid place-items-center text-sm">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Greeting */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back 👋</h1>
            <p className="text-slate-400">
              Here’s a quick overview of your activity (dummy data for now).
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500">
              New Search
            </button>
            <button className="rounded-xl border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900">
              View Profile
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Bookmarked Titles" value="12" hint="+2 this week" />
          <StatCard title="Ratings Given" value="34" hint="+5 this week" />
          <StatCard title="Recent Searches" value="19" hint="Last: “Dune”" />
          <StatCard title="Avg. Rating" value="7.8" hint="Based on your ratings" />
        </section>

        {/* Main grid */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Activity</h2>
              <button className="text-sm text-slate-400 hover:text-slate-200">
                See all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <ActivityRow
                badge="Search"
                title="Searched “Interstellar”"
                meta="2 minutes ago"
              />
              <ActivityRow
                badge="Rating"
                title="Rated “The Dark Knight” — 9/10"
                meta="Yesterday"
              />
              <ActivityRow
                badge="Bookmark"
                title="Bookmarked “Oppenheimer”"
                meta="2 days ago"
              />
              <ActivityRow
                badge="Search"
                title="Searched “Breaking Bad”"
                meta="Last week"
              />
            </div>
          </div>

          {/* Quick actions + Top picks */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <h2 className="font-semibold text-lg">Quick Actions</h2>
              <div className="mt-4 grid gap-3">
                <ActionButton label="Search Titles" />
                <ActionButton label="My Bookmarks" />
                <ActionButton label="My Ratings" />
                <ActionButton label="Logout" variant="danger" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <h2 className="font-semibold text-lg">Top Picks (Dummy)</h2>
              <div className="mt-4 space-y-3">
                <MiniTitleCard title="Dune: Part Two" subtitle="Sci-Fi • 2024" />
                <MiniTitleCard title="The Bear" subtitle="Drama/Comedy • 2022" />
                <MiniTitleCard title="Blade Runner 2049" subtitle="Sci-Fi • 2017" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-xs text-slate-500">
          Need Backend connection !! This page currently uses dummy data.
        </footer>
      </main>
    </div>
  );
}

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  );
}

function ActivityRow({ badge, title, meta }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xs rounded-full border border-slate-700 px-2 py-1 text-slate-300">
          {badge}
        </span>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-slate-500">{meta}</div>
        </div>
      </div>
      <button className="text-sm text-slate-400 hover:text-slate-200">Open</button>
    </div>
  );
}

function ActionButton({ label, variant = "default" }) {
  const base =
    "w-full rounded-xl px-4 py-2 text-sm font-medium transition border";
  const styles =
    variant === "danger"
      ? "border-red-900/50 bg-red-950/40 hover:bg-red-950/70 text-red-200"
      : "border-slate-800 bg-slate-950/40 hover:bg-slate-950/70 text-slate-100";

  return <button className={`${base} ${styles}`}>{label}</button>;
}

function MiniTitleCard({ title, subtitle }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="font-medium">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}
