import React from 'react'
import styles from './TrackListComp.module.css'

function TrackListComp({ token, results, selectedPlaylist, refreshTracks }) {
  async function addTrack(trackUri) {
    if (!selectedPlaylist) {
      alert("Select a playlist first!");
      return;
    }

    await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ uris: [trackUri] })
    });

    // refreshes playlist after adding a track
    if (refreshTracks) {
      refreshTracks();
    }
  }

  return (
	<div className={styles.trackListContainer}>
	  <div className={styles.scrollWrapper}>
	  	<h3 className={styles.playListTitle}>Search Results</h3>
	    <ul>
	      {results.map(track => (
	        <li key={track.id} className={styles.trackItem}>
	          {track.album.images.length > 0 && (
	            <img
	              src={track.album.images[2]?.url || track.album.images[0].url}
	              alt={track.name}
	              className={styles.albumArt}
	            />
	          )}
	          <div className={styles.trackInfo}>
	            {track.name} - {track.artists.map(a => a.name).join(", ")}
	          </div>
	          <button 
	          	className={styles.addButton} 
	          	onClick={() => addTrack(track.uri)}>
  				Add
			  </button>
	        </li>
	      ))}
	    </ul>
	  </div>
	</div>
  );
}

export default TrackListComp;
