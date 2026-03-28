import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen" style={{ backgroundColor: "#191414", color: "#FFFFFF" }}>
      <div style={{ width: "400px", padding: "32px", backgroundColor: "#121212", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#1DB954" }}>Login</h2>
        {error && <p style={{ color: "#FF4C4C", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            style={{ width: "100%", padding: "12px", marginBottom: "12px", backgroundColor: "#222222", color: "#FFFFFF", borderRadius: "4px" }}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={{ width: "100%", padding: "12px", marginBottom: "12px", backgroundColor: "#222222", color: "#FFFFFF", borderRadius: "4px" }}
            onChange={handleChange}
            required
          />
          <button style={{ width: "100%", backgroundColor: "#1DB954", padding: "12px", borderRadius: "4px", fontWeight: "bold", marginTop: "16px" }}>
            Log In
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#1DB954" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
