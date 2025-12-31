import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

import MoviesPage from "./pages/MoviesPage";
// import MovieDetailsPage from "./pages/MovieDetailsPage";

import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";


import BookmarksPage from "./pages/BookmarksPage";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Movies />}/>
        <Route path="/cit23" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieDetails />}/>
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard />// </ProtectedRoute>}/>
        <Route path="/search" element={<ProtectedRoute><SearchPage />// </ProtectedRoute>}/>
      </Routes>
    </Layout>
  );
}

export default App;