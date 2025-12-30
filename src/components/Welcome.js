// src/components/Welcome.js



import React from "react";
import "../styles/Welcome.css";

import Header from "./Header";
import Navbar from "./Navbar";

const Welcome = () => {
  return (
    <div className="welcome-container">
         
      <header>
        <Navbar />
        <Header/>

       
        <h1>HYDERABAD CITY POLICE</h1>
      </header>
                 
    
      <div className="welcome-content">
        <h2>WELCOME TO</h2>
        <h3>OFFICE OF THE JOINT COMMISSIONER OF POLICE</h3>
        <h3>ADMINISTRATION, HYDERABAD CITY</h3>
        <h2>FILE TRACKING SYSTEM</h2>
      </div>

      <footer>
        <p>Powered by - Internal Solutions</p>
      </footer>
    </div>
  );
};

export default Welcome;
