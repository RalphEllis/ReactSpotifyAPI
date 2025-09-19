import React, { useState, useEffect } from 'react';
import styles from './PlayListComp.module.css';

function PlayListComp({ token, selectedPlaylist, setSelectedPlaylist, playlistTracks, setPlaylistTracks }) {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState(""); // For renaming
  const [createName, setCreateName] = useState(""); // For creating new playlists
  const [userId, setUserId] = useState(null); // Store user ID

  // Fetch playlists and user ID when token is available
  useEffect(() => {
    if (token) {
      fetchPlaylists();
      fetchUserId();
    }
  }, [token]);

  // Fetch user's playlists
  async function fetchPlaylists() {
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlaylists(data.items || []);
  }

  // Fetch user ID
  async function fetchUserId() {
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUserId(data.id);
  }

  // Remove a track from the selected playlist
  async function removeTrackFromPlaylist(trackUri) {
    if (!selectedPlaylist) return;

    await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ tracks: [{ uri: trackUri }] }),
    });

    // Refresh tracks
    const res = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlaylistTracks(data.items);
  }

  // Rename a playlist
  async function renamePlaylist(newName) {
    if (!selectedPlaylist) return;

    const res = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      // Update local playlists state
      setPlaylists(prev =>
        prev.map(pl => (pl.id === selectedPlaylist.id ? { ...pl, name: newName } : pl))
      );
      setSelectedPlaylist(prev => (prev ? { ...prev, name: newName } : prev));
      setNewName("");
    } else {
      console.error("Failed to rename playlist:", await res.json());
    }
  }

  // Create a new playlist
  async function createPlaylist() {
    if (!userId || !createName) return;

    const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: createName,
        description: "New playlist created via my app 🎵",
        public: false,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setPlaylists(prev => [...prev, data]);
      setCreateName("");
    } else {
      console.error("Failed to create playlist:", data);
    }
  }

  // Delete a playlist with confirmation
  async function deletePlaylist(playlistId, playlistName) {
    const confirmed = window.confirm(`Are you sure you want to delete the playlist "${playlistName}"?`);
    if (!confirmed) return;

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPlaylists(prev => prev.filter(pl => pl.id !== playlistId));

      if (selectedPlaylist && selectedPlaylist.id === playlistId) {
        setSelectedPlaylist(null);
        setPlaylistTracks([]);
      }
    } else {
      console.error("Failed to delete playlist:", await res.json());
    }
  }

  return (
    <div className={styles.playListContainer}>
      

      {/* Create playlist */}
      <h2 className={styles.playListTitle}>Create New Playlist</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="New playlist name"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          className={styles.spotifyInput}
        />
        <button onClick={createPlaylist} className={styles.createButton}>
          Create New Playlist
        </button>
      </div>

      {/* List of user playlists */}
      <h2 className={styles.playListTitle}>
        Choose a Playlist
      </h2>
      <p>Note: changes will be saved to your actual Spotify Account</p>
      <ul>
        {playlists.map(pl => (
          <li key={pl.id} className={styles.playlistItem}>
            <div
              className={styles.playlistInfo}
              onClick={() => setSelectedPlaylist(pl)}
              style={{ cursor: "pointer" }}
            >
              {pl.name}
            </div>
            <button
              className={styles.deleteButton}
              onClick={() => deletePlaylist(pl.id, pl.name)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Selected playlist details */}
      {selectedPlaylist && (
        <div>
          <h3 className={styles.playListTitle}>Tracks in {selectedPlaylist.name}</h3>

          {/* Rename form */}
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="New playlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={styles.spotifyInput}
            />
            <button onClick={() => renamePlaylist(newName)} className={styles.renameButton}>
              Rename
            </button>
          </div>

          {/* Tracks of the selected playlist */}
          <ul>
            {playlistTracks.map(item => (
              <li key={item.track.id} className={styles.playlistItem}>
                <div className={styles.playlistInfo}>
                  {item.track.name} - {item.track.artists.map(a => a.name).join(", ")}
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => removeTrackFromPlaylist(item.track.uri)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PlayListComp;
