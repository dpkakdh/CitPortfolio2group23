import React from "react";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{ color: "red", padding: "0.5rem 1rem" }}>
      {message}
    </div>
  );
}
