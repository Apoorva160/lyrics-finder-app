import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const searchLyrics = () => {
    if (artist.trim() === "" || song.trim() === "") {
      setLyrics("⚠️ Please enter both artist and song name.");
      return;
    }

    setLoading(true);
    setLyrics("");

    Axios.get(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      .then((res) => {
        setLyrics(res.data.lyrics);
      })
      .catch(() => {
        setLyrics("❌ Lyrics not found. Please check the artist or song name.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyLyrics = () => {
    if (lyrics) {
      navigator.clipboard.writeText(lyrics);
      alert("📋 Lyrics copied to clipboard!");
    }
  };

  const saveToFavorites = () => {
    if (!lyrics || artist === "" || song === "") return;

    const entry = { artist, song, lyrics };
    const updatedFavs = [...favorites, entry];
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    alert("❤️ Lyrics saved to favorites!");
  };
  const removeFromFavorites = (indexToRemove) => {
  const updatedFavs = favorites.filter((_, index) => index !== indexToRemove);
  setFavorites(updatedFavs);
  localStorage.setItem("favorites", JSON.stringify(updatedFavs));
};


  return (
    <div className={`App ${theme === "dark" ? "dark" : ""}`}>
      <h1>🎶 Lyrics Finder </h1>

      <div className="input-group">
        <input
          className="inp"
          type="text"
          placeholder="Artist name"
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          className="inp"
          type="text"
          placeholder="Song name"
          onChange={(e) => setSong(e.target.value)}
        />
      </div>

      <div>
        <button className="btn" onClick={searchLyrics}>🔍 Search</button>
        <button className="action-btn" onClick={copyLyrics}>📋 Copy</button>
        <button className="action-btn" onClick={saveToFavorites}>❤️ Save</button>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <hr />

      {loading ? <p>⏳ Fetching lyrics...</p> : <pre>{lyrics}</pre>}

      {favorites.length > 0 && (
        <>
          <hr />
          <h2>⭐ Saved Favorites</h2>
          {favorites.map((fav, index) => (
  <div className="fav-box" key={index}>
    <strong>{fav.song}</strong> by <em>{fav.artist}</em>
    <pre>{fav.lyrics.slice(0, 200)}...</pre>
    <button
      className="action-btn"
      style={{ backgroundColor: "#d9534f" }}
      onClick={() => removeFromFavorites(index)}
    >
      Remove
    </button>
  </div>
))}

        </>
      )}
    </div>
  );
}

export default App;
