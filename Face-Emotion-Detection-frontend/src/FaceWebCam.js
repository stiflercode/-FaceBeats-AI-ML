// import React, { useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import cv from '@techstark/opencv-js';

// const WebcamWithBlur = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const videoElement = webcamRef.current.video;
//     const canvasElement = canvasRef.current;

//     const processVideo = async () => {
//       const frame = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
//       const src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
//       const gray = new cv.Mat();
//       const faces = new cv.RectVector();

//       // Capture frame from video element
//       const context = canvasElement.getContext('2d');
//       context.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
//       const imageData = context.getImageData(0, 0, videoElement.width, videoElement.height);
//       src.data.set(imageData.data);

//       // Convert frame to grayscale
//       cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//       // Detect faces
//       const faceClassifier = new cv.CascadeClassifier();
//       await faceClassifier.load('haarcascade_frontalface_default.xml');
//       faceClassifier.detectMultiScale(gray, faces);

//       // Draw rectangles around detected faces
//       const { width, height } = videoElement;
//       for (let i = 0; i < faces.size(); i++) {
//         const faceRect = faces.get(i);
//         const point1 = new cv.Point(faceRect.x, faceRect.y);
//         const point2 = new cv.Point(faceRect.x + faceRect.width, faceRect.y + faceRect.height);
//         cv.rectangle(src, point1, point2, new cv.Scalar(255, 0, 0, 255));
//       }

//       // Apply blur effect to the areas outside of detected faces
//       const blurKernelSize = new cv.Size(25, 25);
//       const blurred = new cv.Mat();
//       cv.GaussianBlur(src, blurred, blurKernelSize, 30, 30);

//       // Display the processed frame
//       cv.imshow(canvasElement, blurred);

//       // Clean up
//       frame.delete();
//       src.delete();
//       gray.delete();
//       faces.delete();
//       blurred.delete();

//       requestAnimationFrame(processVideo);
//     };

//     // Start processing video frames
//     processVideo();
//   }, []);

//   const videoConstraints = {
//     width: 1280,
//     height: 720,
//     facingMode: 'user',
//   };

//   return (
//     <div>
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         videoConstraints={videoConstraints}
//         style={{ display: 'none' }} // Hide the actual video element
//       />
//       <canvas ref={canvasRef} width={videoConstraints.width} height={videoConstraints.height} />
//     </div>
//   );
// };

// export default WebcamWithBlur;
