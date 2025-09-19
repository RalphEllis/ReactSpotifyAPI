import React, { useState, useEffect } from 'react'
import styles from './MainDisplayComp.module.css'
import LoginComp from './LoginComp'
import TrackListComp from './TrackListComp'
import PlayListComp from './PlayListComp'
import SearchBarComp from './SearchBarComp'
/* import PlayPreviewComp from './PlayPreviewComp' // deprecated */
import useSpotifyAuth from "./UseSpotifyAuth.jsx";

function MainDisplayComp() {
  const { token, login, logout } = useSpotifyAuth();
  const [results, setResults] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    refreshSelectedPlaylistTracks();
  }, [selectedPlaylist]);

  // Function to refresh tracks of the selected playlist
  const refreshSelectedPlaylistTracks = async () => {
    if (!selectedPlaylist) return;

    const res = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlaylistTracks(data.items);
  };


	useEffect(() => {
	  if (token) {
	    fetch("https://api.spotify.com/v1/me", {
	      headers: { Authorization: `Bearer ${token}` },
	    })
	      .then((res) => res.json())
	      .then((data) => setUserName(data.display_name))
	      .catch(console.error);
	  }
	}, [token]);

	return (
	  <div className={styles.mainDisplayContainer}>
	    {!token ? (
		    <>
		      <h3 className={styles.loginTitle}>Spotify Playlist Editor</h3>
		      <LoginComp 
		        token={token}
		        login={login}
		        logout={logout}
		      />
		    </>
	    ) : (
	      <>
	        <div className={styles.topBar}>
	          {token && <p className={styles.usernameText}>Logged in as: {userName}</p>}
	          <button onClick={logout} className={styles.logoutButton}>
	            Log out
	          </button>
	        </div>

	        <div className={styles.titleContainer}>
	        <h2 className={styles.playListTitle}>Spotify Playlist Editor</h2> 
	        </div>

	        <SearchBarComp 
	          token={token} 
	          onResults={setResults} 
	        />

	        <TrackListComp
	          token={token}
	          results={results}
	          selectedPlaylist={selectedPlaylist}
	          refreshTracks={refreshSelectedPlaylistTracks}
	        />

	        <PlayListComp
	          token={token}
	          selectedPlaylist={selectedPlaylist}
	          setSelectedPlaylist={setSelectedPlaylist}
	          playlistTracks={playlistTracks}
	          setPlaylistTracks={setPlaylistTracks}
	        />
	      </>
	    )}
	  </div>
	);
}

export default MainDisplayComp;
