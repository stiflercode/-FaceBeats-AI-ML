import { useState } from "react";
import {BrowserRouter , Routes, Route } from "react-router-dom";
import "./App.css";
import Spotify from "./Spotify/Spotify";
import Signup from "./Spotify/Signup";
import Login from "./Spotify/Login";
import Protected from "./Spotify/Protected";
import Profile from "./Spotify/Profile";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Spotify />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
