import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
    Username: username,      
    FullName: fullName,      
    Email: email,            
    PasswordHash: password,  
  };
    
    console.log("Register payload:", payload);

    try {
      await registerUser(payload);

      navigate("/login");
    } catch (err) {
      // Catch both Axios error response and other JS errors
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center rounded-3xl border border-slate-800 bg-slate-900/30 p-10 relative overflow-hidden">
          <div className="absolute -top-32 -right-24 h-72 w-72 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 bg-fuchsia-500/20 blur-3xl rounded-full" />
          <div className="flex items-center gap-3 z-10">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            <div>
              <p className="text-slate-400 text-sm">Cit23</p>
              <h1 className="text-xl font-semibold">Create Account</h1>
            </div>
          </div>
          <p className="mt-6 text-slate-300 z-10">
            Register to access personalized bookmarks, ratings, and analytics.
          </p>
          <div className="mt-8 space-y-3 z-10">
            <Feature text="Save bookmarks and view later" />
            <Feature text="Rate and track rating history" />
            <Feature text="Secure authentication using JWT" />
            <Feature text="TMDB images for people profiles" />
          </div>
        </div>

        {/* Right Form */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Register</h2>
            <Link
              to="/"
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              Back Home
            </Link>
          </div>

          <p className="text-slate-400 mt-2 text-sm">
            Create your account by filling in the details below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-slate-300">Username</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 outline-none focus:border-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="portfoliogroup23"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Full Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 outline-none focus:border-indigo-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 outline-none focus:border-indigo-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 outline-none focus:border-indigo-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold transition
                         hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-sm text-slate-400 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-200 hover:underline">
                Login here
              </Link>
            </p>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center">
            Your password is securely hashed before storage.
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
      {text}
    </div>
  );
}
