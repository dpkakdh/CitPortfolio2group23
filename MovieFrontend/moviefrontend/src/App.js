import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";

import BookmarksPage from "./pages/BookmarksPage";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
// import RatingsPage from "./pages/RatingsPage"; // <-- create/import this

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/cit23" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Protected routes */}
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/ratings"
          element={
            <ProtectedRoute>
              <RatingsPage />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
