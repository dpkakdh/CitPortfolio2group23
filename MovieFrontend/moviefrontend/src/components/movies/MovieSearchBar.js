// import React, { useState } from "react";

// export default function MovieSearchBar({ onSearch, initialQuery = "" }) {
//   const [query, setQuery] = useState(initialQuery);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSearch(query);
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
//       <input
//         type="text"
//         placeholder="Search titles..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem" }}
//       />
//       <button type="submit">Search</button>
//     </form>
//   );
// }
