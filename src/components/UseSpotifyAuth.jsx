import { useEffect, useState } from "react";

// 🔑 Config
const CLIENT_ID = "7ef5244907074a13ad7cf5b118d89495";
const REDIRECT_URI = "https://ralphellis.github.io/ReactSpotifyAPI/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

// The scopes you need
const SCOPES = [
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private"
];

function generateRandomString(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function useSpotifyAuth() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    let storedToken = window.localStorage.getItem("token");

    if (!storedToken && code) {
      // Step 3: exchange authorization code for token
      const codeVerifier = window.localStorage.getItem("code_verifier");

      const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
      });

      fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            setToken(data.access_token);
            window.localStorage.setItem("token", data.access_token);
            // clear ?code=... from the URL
            window.history.replaceState({}, document.title, "/");
          }
        });
    } else {
      setToken(storedToken);
    }
  }, []);

  // Step 1: build login URL with PKCE
  const login = async () => {
    const codeVerifier = generateRandomString(128);
    window.localStorage.setItem("code_verifier", codeVerifier);

    const codeChallenge = await sha256(codeVerifier).then(base64UrlEncode);

    const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES.join("%20")}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    window.location = loginUrl;
  };

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return { token, login, logout };
}

export default useSpotifyAuth;
