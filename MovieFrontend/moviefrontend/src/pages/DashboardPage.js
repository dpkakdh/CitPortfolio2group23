import React, { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboardApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h2>Dashboard</h2>
      {!data ? (
        <p>No dashboard data available.</p>
      ) : (
        <ul>
          {/* Adjust to match your Dashboard DTO */}
          <li>Total ratings: {data.totalRatings}</li>
          <li>Average rating: {data.averageRating}</li>
          <li>Total bookmarks: {data.totalBookmarks}</li>
          <li>Total searches: {data.totalSearches}</li>
        </ul>
      )}
    </div>
  );
}
