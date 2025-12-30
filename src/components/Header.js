



import React from "react";
import "../styles/Header.css";
import logo from "../assets/logo.png"; // ✅ replace with your logo file path

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="Logo" className="header-logo" />
        <div className="header-title">
          <h1 className="title">OFFICE OF THE JOINT COMMISSIONER OF POLICE</h1>
          <h2 className="subtitle">ADMINISTRATION, HYDERABAD CITY</h2>
          <h3 className="subtitle2">FILE TRACKING SYSTEM</h3>
        </div>
      </div>
    </header>
  );
};

export default Header;