import React, { useState } from "react";
import MovieSearchBar from "../components/movies/MovieSearchBar";
import MovieGrid from "../components/movies/MovieGrid";
import { searchTitles } from "../api/searchApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const data = await searchTitles(query);
      setResults(data.items || data);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Titles</h2>
      <MovieSearchBar onSearch={handleSearch} />
      {loading && <Loader />}
      <ErrorMessage message={error} />
      <MovieGrid movies={results} />
    </div>
  );
}
