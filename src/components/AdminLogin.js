// src/components/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";
import logo from "../assets/logo.png";
import API from "../config/api";

const AdminLogin = () => {
  const [login, setLogin] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/api/admin/login", {
        username: login.username,
        password: login.password,
      });

      // ✅ Save JWT token
      localStorage.setItem("token", response.data.token);

      
      navigate("/welcome"); // Redirect to your welcome/dashboard

    } catch (error) {
      alert("❌ Invalid Username or Password");
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <img src={logo} alt="Police Logo" className="logo" />
        <h1 className="text">FILE TRACKING SYSTEM</h1>
      </header>

      <div className="sub-header">
        <h2>OFFICE OF THE JOINT COMMISSIONER OF POLICE</h2>
        <h3>ADMINISTRATION, HYDERABAD CITY</h3>
      </div>

      <div className="login-box">
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={login.username}
            onChange={handleChange}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={login.password}
            onChange={handleChange}
            required
          />
          <button type="submit">LOGIN</button>
        </form>
      </div>

      <footer className="footer">Ver 1.0</footer>
    </div>
  );
};

export default AdminLogin;
