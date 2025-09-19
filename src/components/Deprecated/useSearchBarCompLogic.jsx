import React, { useState } from 'react'
import styles from './SearchBarComp.module.css'

function SearchBarComp({ token, onResults }) {
  const [query, setQuery] = useState("");

  const searchSongs = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Search results:", data);

      if (data.tracks && data.tracks.items) {
        onResults(data.tracks.items); // send results up
      } else {
        onResults([]);
      }
    } catch (error) {
      console.error("Error searching songs:", error);
      onResults([]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={searchSongs}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBarComp;