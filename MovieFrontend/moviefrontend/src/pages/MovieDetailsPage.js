// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getMovieById } from "../api/moviesApi";
// import { addBookmark } from "../api/bookmarksApi";
// import { rateTitle } from "../api/ratingsApi";
// import Loader from "../components/common/Loader";
// import ErrorMessage from "../components/common/ErrorMessage";

// export default function MovieDetailsPage() {
//   const { id } = useParams();
//   const [movie, setMovie] = useState(null);
//   const [ratingValue, setRatingValue] = useState(0);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       setError("");
//       try {
//         const data = await getMovieById(id);
//         setMovie(data);
//       } catch (err) {
//         console.error(err);
//         setError("Could not load movie details.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [id]);

//   const handleBookmark = async () => {
//     setError("");
//     setMessage("");
//     try {
//       await addBookmark(id);
//       setMessage("Added to bookmarks.");
//     } catch (err) {
//       setError("Could not bookmark this title.");
//     }
//   };

//   const handleRate = async () => {
//     setError("");
//     setMessage("");
//     try {
//       await rateTitle(id, Number(ratingValue));
//       setMessage("Rating saved.");
//     } catch (err) {
//       setError("Could not save rating.");
//     }
//   };

//   if (loading) return <Loader />;
//   if (!movie) return <p>No movie found.</p>;

//   return (
//     <div>
//       <h2>{movie.primaryTitle || movie.originalTitle}</h2>
//       <p>{movie.plot || movie.description}</p>
//       <p>Year: {movie.startYear}</p>
//       <p>Runtime: {movie.runtimeMinutes} min</p>

//       <button onClick={handleBookmark}>Bookmark</button>

//       <div style={{ marginTop: "1rem" }}>
//         <label>
//           Your rating (1–10):{" "}
//           <input
//             type="number"
//             min="1"
//             max="10"
//             value={ratingValue}
//             onChange={(e) => setRatingValue(e.target.value)}
//           />
//         </label>
//         <button onClick={handleRate} style={{ marginLeft: "0.5rem" }}>
//           Save rating
//         </button>
//       </div>

//       <ErrorMessage message={error} />
//       {message && <p style={{ color: "green" }}>{message}</p>}
//     </div>
//   );
// }
