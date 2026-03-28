import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react"; // Import User icon

function Profile() {
  const [playlist, setPlaylist] = useState(["Song 1", "Song 2", "Song 3"]); // Initialize playlist state with dummy data
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || 'dhirajksahu01@gmail.com'; // Get email from localStorage

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get_playlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  const removeFromPlaylist = async (songName) => {
    try {
      await axios.post(
        "http://localhost:5000/remove_from_playlist",
        { song_name: songName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Song removed from playlist!");
      fetchPlaylist();
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      alert("Failed to remove song from playlist.");
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white p-4">

      <Link to="/" className="flex items-center mb-4 cursor-pointer">
        <ArrowLeft color="white" size={24} className="mr-2" />
        <span>Back to Spotify</span>
      </Link>

      <div className="flex items-center mb-4 bg-green-500 text-white p-4 rounded-lg">
        <User color="white" size={40} className="mr-2" />
        <div>
          <h2 className="text-xl font-semibold">{email}</h2>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-left">Your Playlist</h1>
      {playlist.length === 0 ? (
        <p>Your playlist is empty.</p>
      ) : (
        <ul>
          {playlist.map((song, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-700"
            >
              <span>{song}</span>
              <button
                className="bg-red-600 px-3 py-1 rounded-md"
                onClick={() => removeFromPlaylist(song)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;