import React, { useEffect, useState } from "react";
import { getBookmarks, removeBookmark } from "../api/bookmarksApi";
import MovieGrid from "../components/movies/MovieGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (err) {
      setError("Could not load bookmarks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (titleId) => {
    try {
      await removeBookmark(titleId);
      await load();
    } catch {
      setError("Could not remove bookmark.");
    }
  };

  return (
    <div>
      <h2>My Bookmarks</h2>
      {loading && <Loader />}
      <ErrorMessage message={error} />
      {bookmarks.length === 0 ? (
        <p>You have no bookmarks yet.</p>
      ) : (
        <>
          <MovieGrid movies={bookmarks} />
          <p style={{ fontSize: "0.9rem" }}>
            ( "Remove" button in MovieCard)
          </p>
        </>
      )}
    </div>
  );
}
