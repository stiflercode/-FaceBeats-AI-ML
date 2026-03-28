import React, { useState, useRef , useEffect} from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Webcam from "react-webcam";
import axios from "axios";
import camera from "../assets/photos/camera.png";
import arrow from "../assets/photos/arrow (1).png";
import spotify from "../assets/photos/spotify-logo-png-7078.png";
import { Camera, User } from "lucide-react";
import { RiNeteaseCloudMusicFill } from "react-icons/ri";
import { Link } from "react-router-dom";

// Emotion-based song collections
const EMOTION_SONGS = {
  Happy: ["Happy.mp3", "Happy2.mp3", "Happy3.mp3"],
  Sad: ["Sad.mp3", "Sad2.mp3", "Sad3.mp3"],
  Neutral: [
    "Neutral.mp3",
    "Neutral2.mp3",
    "Neutral3.mp3",
    "Neutral4.mp3",
    "Neutral5.mp3",
  ],
  Disgusted: ["Disgusted.mp3"],
  Angry: ["Angry.mp3", "Angry2.mp3", "Angry3.mp3"],
  Surprised: ["Surprised.mp3"],
  Fear: ["Fear.mp3", "Fear2.mp3", "Fear3.mp3"],
  Travel: ["Travel.mp3", "Travel2.mp3", "Travel3.mp3"],
};

const searchSongs = [
  { Happy: "Happy.mp3" },
  { Happy2: "Happy2.mp3" },
  { Happy3: "Happy3.mp3" },
  { Sad: "Sad.mp3" },
  { Sad2: "Sad2.mp3" },
  { Sad3: "Sad3.mp3" },
  { Neutral: "Neutral.mp3" },
  { Neutral2: "Neutral2.mp3" },
  { Neutral3: "Neutral3.mp3" },
  { Neutral4: "Neutral4.mp3" },
  { Neutral5: "Neutral5.mp3" },
  { Disgusted: "Disgusted.mp3" },
  { Angry: "Angry.mp3" },
  { Angry2: "Angry2.mp3" },
  { Angry3: "Angry3.mp3" },
  { Surprised: "Surprised.mp3" },
  { Fear: "Fear.mp3" },
  { Fear2: "Fear2.mp3" },
  { Fear3: "Fear3.mp3" },
  { Ilahi: "Travel.mp3" },
  { "Kashmir tu mai Kanyakumari": "Travel2.mp3" },
  { "Suraj Dooba hai": "Travel3.mp3" },
];

function Spotify() {
  const [song, setSong] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState("");
  const [songIndex, setSongIndex] = useState(0);
  const [cam, setCam] = useState(true);

  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const [currentFace, setCurrentFace] = useState("");
  const [search, setSearch] = useState("");

  const startCapture = () => {
    setCapturing(true);
    captureIntervalRef.current = setInterval(captureImage, 1000);
  };

  const token = localStorage.getItem("token");
  const [userPlaylist, setUserPlaylist] = useState([]);

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
      setUserPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  const handlePlaylistToggle = async (songName) => {
    const isSongInPlaylist = userPlaylist.includes(songName);

    try {
      if (isSongInPlaylist) {
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
      } else {
        await axios.post(
          "http://localhost:5000/add_playlist",
          { song_name: songName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Song added to playlist!");
      }
      fetchPlaylist(); // Refresh the playlist after adding/removing
    } catch (error) {
      console.error("Error toggling playlist:", error);
      alert("Failed to update playlist.");
    }
  };

  const stopCapture = () => {
    setCapturing(false);
    clearInterval(captureIntervalRef.current);
  };

  const captureImage = () => {
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(sendImageToBackend, "image/jpeg");
  };

  const sendImageToBackend = async (blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const response = await axios.post("http://localhost:5000/img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const predictedEmotion = response.data.predicted_emotion;
      setCurrentFace(predictedEmotion);

      if (predictedEmotion !== "No face detected") {
        setCam(true);
        stopCapture();
        setCurrentEmotion(predictedEmotion);

        const emotionSongs = EMOTION_SONGS[predictedEmotion] || [];
        const randomIndex = Math.floor(Math.random() * emotionSongs.length);
        setSongIndex(randomIndex);
        setSong(emotionSongs[randomIndex]);
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }
  };

  const navigateSong = (direction) => {
    if (!currentEmotion) return;

    const emotionSongs = EMOTION_SONGS[currentEmotion];
    const totalSongs = emotionSongs.length;

    let newIndex =
      direction === "next"
        ? (songIndex + 1) % totalSongs
        : (songIndex - 1 + totalSongs) % totalSongs;
    console.log(song);

    setSongIndex(newIndex);
    setSong(emotionSongs[newIndex]);
  };

  return (
    <div className="w-full h-screen bg-black">
      {!cam ? (
        <div
          className="flex items-center justify-start p-4 cursor-pointer"
          onClick={() => setCam(true)}
        >
          <img src={arrow} alt="Back" className="w-8 h-8 mr-2" />
          <h2 className="text-white">Go back</h2>
        </div>
      ) : null}

      {cam ? (
        <div className="container mx-auto px-4 py-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-white font-bold mr-2">FaceBeats</h2>
              <RiNeteaseCloudMusicFill size={25} color="limegreen" />
              {/* <Music color="limegreen" size={25} /> */}
              {/* <img src={spotify} alt="Spotify" className="w-10 h-10" /> */}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setCam(false)}
            >
              <Camera color="white" size={35} />
              <Link to="/profile">
                <User color="white" size={35} className="ml-2" />
              </Link>
              {/* <h2 className="text-white font-bold mr-2">Cam</h2>
              <img
                src={camera}
                alt="Camera"
                className="w-8 h-8 cursor-pointer"
                onClick={() => setCam(false)}
              /> */}
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search Songs"
              className="w-full p-2 rounded-lg bg-gray-800 text-white my-4"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2 text-white text-left">
                  Search Results
                </h2>
                {searchSongs
                  .filter((song) =>
                    Object.keys(song)[0]
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((song) => (
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-white">{Object.keys(song)[0]}</h2>
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded-lg"
                        // Add logic to play that song on click
                        onClick={() => setSong(Object.values(song)[0])}
                      >
                        Play
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(EMOTION_SONGS).map(([emotion, songs]) => (
              <div
                key={emotion}
                className={`bg-gray-800 text-white p-2 rounded-lg hover:bg-green-700 transition-colors 
                  ${song.startsWith(emotion) ? "bg-green-600" : ""}`}
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * songs.length);
                  setCurrentEmotion(emotion);
                  setSongIndex(randomIndex);
                  setSong(songs[randomIndex]);
                }}
              >
                <h2 className="text-l font-bold">{emotion} Songs</h2>
              </div>
            ))}
          </div>

          {song && (
            <div className="fixed bottom-0 left-0 w-full p-2 bg-gray-900">
              <div className="playbar">
                <AudioPlayer
                  key={song} // Add this line to force re-render
                  src={`/songs/${song}`}
                  autoPlay
                  layout="stacked"
                  className="custom-audio-player"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "100%",
                    height: "80px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-l"
                  onClick={() => navigateSong("previous")}
                >
                  Previous
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-r ml-2"
                  onClick={() => navigateSong("next")}
                >
                  Next
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-r ml-2"
                  onClick={() => handlePlaylistToggle(song)}
                >
                  {userPlaylist.includes(song)
                    ? "Remove from Playlist"
                    : "Add to Playlist"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <h1 className="text-2xl mb-4 text-white">Emotion Detection</h1>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
            className="w-full max-w-2xl mx-auto"
          />
          <div className="mt-8">
            {capturing ? (
              <button
                className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 mr-4"
                onClick={stopCapture}
              >
                Stop Capture
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                onClick={startCapture}
              >
                Start Capture
              </button>
            )}
          </div>
          {capturing && (
            <h3 className="text-white mt-4">You are: {currentFace}</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default Spotify;
