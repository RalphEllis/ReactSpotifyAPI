import React from "react";
import styles from "./LoginComp.module.css";

function LoginComp({ token, login, logout }) {
  return (
    <div className={styles.loginContainer}>
      {!token ? (
        <button onClick={login} className={styles.loginButton}>
          Log in with Spotify
        </button>
      ) : (
        <>
          <span className={styles.loggedInText}>Logged in!</span>
          <button onClick={logout} className={styles.logoutButton}>
            Log out
          </button>
        </>
      )}
    </div>
  );
}

export default LoginComp;
