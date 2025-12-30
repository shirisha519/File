// src/components/Layout.js
import React from "react";
import Navbar from './Navbar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />  
      <Navbar />  
      <main className="layout-content">{children}</main>
    </div>
  );
};

export default Layout;
