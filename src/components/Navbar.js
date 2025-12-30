



import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);

  const handleMouseEnter = (menu) => setOpenDropdown(menu);
  const handleMouseLeave = () => {
    setOpenDropdown(null);
    setOpenSubDropdown(null);
  };

  const handleClick = () => {
    // close dropdowns after clicking a link
    setOpenDropdown(null);
    setOpenSubDropdown(null);
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {/* 1️⃣ Inward */}
        <li
          className="nav-item dropdown"
          onMouseEnter={() => handleMouseEnter("inward")}
          onMouseLeave={handleMouseLeave}
        >
          <span className="dropdown-title">Inward ▾</span>
          {openDropdown === "inward" && (
            <ul className="dropdown-menu" onClick={handleClick}>
              <li>
                <Link to="/InwardForm">Admin Branch</Link>
              </li>
              <li>
                <Link to="/AccountBranch">Accounts Branch</Link>
              </li>
              <li>
                <Link to="/InwardSearch">Search Inward</Link>
              </li>
            </ul>
          )}
        </li>

        {/* 2️⃣ Outward */}
        <li
  className="nav-item dropdown"
  onMouseEnter={() => handleMouseEnter("outward")}
  onMouseLeave={handleMouseLeave}
>
  <span className="dropdown-title">Outward ▾</span>

  {openDropdown === "outward" && (
    <ul className="dropdown-menu">
      <li><Link to="/OutwardAdmin">Admin Branch</Link></li>
      <li><Link to="/OutwardAccounts">Accounts Branch</Link></li>

      <li
        className="nav-item dropdown-sub"
        onMouseEnter={() => setOpenSubDropdown("printOutward")}
        onMouseLeave={() => setOpenSubDropdown(null)}
      >
        <span className="dropdown-sub-title">Print Outward ▸</span>

        {openSubDropdown === "printOutward" && (
          <ul className="dropdown-submenu">
            <li><Link to="/OutwardPrintAdmin">Admin</Link></li>
            <li><Link to="/OutwardPrintAccounts">Accounts</Link></li>
          </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>

        {/* 3️⃣ File Status */}
        <li
              className="nav-item dropdown"
              onMouseEnter={() => handleMouseEnter("fileStatus")}
              onMouseLeave={handleMouseLeave}
            >
              <span className="dropdown-title">File Status ▾</span>

              {openDropdown === "fileStatus" && (
                <ul className="dropdown-menu" onClick={handleClick}>
                  <li><Link to="/FileStatus">Admin Branch</Link></li>
                  <li><Link to="/FileStatusAccounts">Accounts Branch</Link></li>
                 
                </ul>
              )}
            </li>


        {/* 4️⃣ Pending Files */}
        <li
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter("pendingFiles")}
            onMouseLeave={handleMouseLeave}
          >
            <span className="dropdown-title">Pending Files ▾</span>

            {openDropdown === "pendingFiles" && (
              <ul className="dropdown-menu" onClick={handleClick}>
                 <li><Link to="/pending/admin">Admin Branch</Link></li>
                 <li><Link to="/pending/accounts">Accounts Branch</Link></li>
              </ul>
            )}
          </li>

        {/* 5️⃣ Tappal */}
        <li
            className="nav-item dropdown"
            onMouseEnter={() => handleMouseEnter("tappal")}
            onMouseLeave={handleMouseLeave}
          >
            <span className="dropdown-title">Tappal ▾</span>

            {openDropdown === "tappal" && (
              <ul className="dropdown-menu" onClick={handleClick}>
                <li><Link to="/tappal/received">Tapal Received</Link></li>
                <li><Link to="/tappal/dispatch">Tapal Dispatch</Link></li>
                <li><Link to="/tappal/search">Tapal Search</Link></li>
                <li><Link to="/tappal/pending">Tapal Pending files</Link></li>
                <li><Link to="/tappal/print">Print Tapal</Link></li>
              </ul>
              )}
            </li>

        {/* 7️⃣ Logout */}
        <li className="nav-item">
          <Link to="/Logout" onClick={handleClick}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
