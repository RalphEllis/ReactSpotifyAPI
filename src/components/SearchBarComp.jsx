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
    <div className={styles.searchBarContainer}>
      <h3 className={styles.playListTitle}>
        Search for a song to add to your playlist
      </h3>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.spotifyInput}
        />
        <button
          onClick={searchSongs}
          className={styles.searchButton}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBarComp;