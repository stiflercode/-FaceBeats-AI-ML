import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const WebcamCapture = () => {
  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFace,setCurrentFace] = useState('');

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
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the captured image to a Blob
    canvas.toBlob(sendImageToBackend, 'image/jpeg');
  };

  const sendImageToBackend = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      const response = await axios.post('http://localhost:5000/img', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      setCurrentFace(response.data.predicted_emotion)
    } catch (error) {
      console.error('Error sending image to backend:', error);
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
      <h1>Emotion Detection</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
        style={{ width: '100%', maxWidth: '800px' }}
      />
      <br></br>
      {capturing ? (
        <button onClick={stopCapture}>Stop Capture</button>
      ) : (
        <button onClick={startCapture}>Start Capture</button>
      )}

     

      {capturing ? <div>

        <h3>You are : {currentFace}</h3>
      </div> : 
      
      <div></div>
      }
    </div>
  );
}; 

export default WebcamCapture;
