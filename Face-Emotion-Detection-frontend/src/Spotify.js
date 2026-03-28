import logo from "./logo.svg";
import "./Spotify.css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useState, useRef } from "react";
import camera from "./photo-camera.png";
import arrow from "./arrow (1).png";
import axios from "axios";
import Webcam from "react-webcam";
import spotify from "./spotify-logo-png-7078.png";

function Spotify() {
  const [song, setSong] = useState("");
  const [cam, getcam] = useState(true);

  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFace, setCurrentFace] = useState("");

  const startCapture = () => {
    setCapturing(true);
    captureIntervalRef.current = setInterval(captureImage, 1000); // Capture an image every second
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

    // Convert the captured image to a Blob
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

      console.log(response.data);
      setCurrentFace(response.data.predicted_emotion);
      if (response.data.predicted_emotion !== "No face detected") {
        getcam(true);
        stopCapture();
        setSong(response.data.predicted_emotion + ".mp3");
        console.log(response.data.predicted_emotion + ".mp3");
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSendToBackend = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        sendImageToBackend(reader.result);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };
  return (
    <div>
      <style>{`
        .custom-audio-player .rhap_progress-filled {
          background-color: purple;
        }
      
      `}</style>
      {!cam ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "150px",
            margin: "10px",
          }}
          onClick={(abc) => (abc = getcam((abc) => (abc = true)))}
        >
          <img src={arrow} width={"30px"}></img>
          <h2>Go back</h2>
          <br></br>
        </div>
      ) : (
        <div></div>
      )}

      {cam ? (
        <div className="container flex bg-black">
          <div className="right bg-grey rounded">
            <div className="header">
              <div className="nav">
                <div
                  className="hamburgerContainer"
                  style={{
                    paddingLeft: "10px",
                    paddingTop: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100vh",
                  }}
                >
                  <img
                    src={camera}
                    width={"30px"}
                    height={"30px"}
                    onClick={(abc) =>
                      (abc = getcam((abc) => {
                        return cam == true ? false : true;
                      }))
                    }
                  ></img>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <h2 style={{ marginTop: "5px", marginRight: "5px" }}>
                      <b>Spotify</b>
                    </h2>
                    <img src={spotify} width={"40px"}></img>
                  </div>
                </div>
              </div>
              <div className="buttons">
                <button
                  className="signupbtn"
                  onclick="location.href='http://localhost/simple%20php%20system/register.php'"
                >
                  Sign up
                </button>
                <button
                  className="loginbtn"
                  onclick="location.href='http://localhost/simple%20php%20system/'"
                >
                  Log in
                </button>
              </div>
            </div>
            <div className="spotifyPlaylists">
              <h1>Spotify Playlists</h1>
              <div className="cardContainer">
                <div
                  className="card"
                  onClick={(abc) =>
                    (abc = setSong((abc) => (abc = "Happy.mp3")))
                  }
                  style={
                    song == "Happy.mp3"
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                >
                  <div className="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="#000000"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <img
                    src="https://i.scdn.co/image/ab67616d0000b2734591aa44711929919203027a"
                    alt=""
                  />
                  <h2>Happy Hits!</h2>
                  <p>hits to boost your mood and fill you with happiness.</p>
                </div>
                <div
                  className="card"
                  onClick={(abc) => (abc = setSong((abc) => (abc = "Sad.mp3")))}
                  style={
                    song == "Sad.mp3"
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                >
                  <div className="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="#000000"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <img
                    src="https://www.listenspotify.com/uploaded_files/Thf_1644083140.jpg"
                    alt=""
                  />
                  <h2>Sad Songs!</h2>
                  <p>here's songs to break your heart.</p>
                </div>
                <div
                  className="card"
                  onClick={(abc) =>
                    (abc = setSong((abc) => (abc = "Neutral.mp3")))
                  }
                  style={
                    song == "Neutral.mp3"
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                >
                  <div className="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="#000000"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <img
                    src="https://i.scdn.co/image/ab67616d0000b273632620401c34d07336a091bc"
                    alt=""
                  />
                  <h2>Nutral Songs!</h2>
                  <p>Finding peace in the simplicity of neutrality.</p>
                </div>
                <div
                  className="card"
                  onClick={(abc) =>
                    (abc = setSong((abc) => (abc = "Disgusted.mp3")))
                  }
                  style={
                    song == "Disgusted.mp3"
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                >
                  <div className="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="#000000"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <img
                    src="https://i.scdn.co/image/ab67616d00001e0292a8592234d1bec319e5afc6"
                    alt=""
                  />
                  <h2>Disgusted Songs!</h2>
                  <p>Sameness is the mother of disgust, variety the cure.</p>
                </div>
                <div
                  className="card"
                  onClick={(abc) =>
                    (abc = setSong((abc) => (abc = "Angry.mp3")))
                  }
                  style={
                    song == "Angry.mp3"
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                >
                  <div className="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="#000000"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <img
                    src="https://i.scdn.co/image/ab67616d00001e0200379b8904a73a542198c068"
                    alt=""
                  />
                  <h2>Angry Songs!</h2>
                  <p>My sadness turned to anger.</p>
                </div>
                <div
                  className="card"
                  onClick={(abc) =>
                    (abc = setSong((abc) => (abc = "Surprised.mp3")))
                  }
                  style={
                    song == "Surprised.mp3"
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                >
                  <div className="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="#000000"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <img
                    src="https://i.scdn.co/image/ab67616d0000b273bd33eb14fb7f31384ca042c4"
                    alt=""
                  />
                  <h2>Surprised Songs!</h2>
                  <p>Hurrah! My life is full of surprises.</p>
                </div>
                <div
                  className="card"
                  onClick={(abc) =>
                    (abc = setSong((abc) => (abc = "Fear.mp3")))
                  }
                  style={
                    song == "Fear.mp3"
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                >
                  <div className="play">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="#000000"
                      fill="none"
                    >
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <img
                    src="https://i.scdn.co/image/ab67616d0000b273fe2568db557a3e03c48dbc1e"
                    alt=""
                  />
                  <h2>Fear Songs!</h2>
                  <p>Always do what you are afraid to do.</p>
                </div>
              </div>
              <div className="playbar">
                <div></div>
                <AudioPlayer
                  style={{ width: "85%", backgroundColor: "white" }}
                  autoPlay
                  src={process.env.PUBLIC_URL + "/" + song}
                  onPlay={(e) => console.log("onPlay")}
                  className="custom-audio-player"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* In your JSX component */
        <div
          style={{
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem" }}>Emotion Detection</h1>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
            style={{ width: "100%", maxWidth: "800px" }}
          />
          <div style={{ margin: "20px 0" }}>
            {capturing ? (
              <button
                style={{
                  padding: "12px 24px",
                  fontSize: "1rem",
                  margin: "0 10px",
                }}
                onClick={stopCapture}
              >
                Stop Capture
              </button>
            ) : (
              <button
                style={{
                  padding: "12px 24px",
                  fontSize: "1rem",
                  margin: "0 10px",
                }}
                onClick={startCapture}
              >
                Start Capture
              </button>
            )}
          </div>
          {capturing && (
            <h3 style={{ fontSize: "1.2rem", marginTop: "15px" }}>
              You are: {currentFace}
            </h3>
          )}
        </div>
      )}
    </div>
  );
}

export default Spotify;
