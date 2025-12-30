


import React, { useState } from "react";
import API from "../config/api";
import "../styles/PendingFilesAccounts.css";



const PendingFilesAccounts = () => {
  const [fileNo, setFileNo] = useState("");
  const [section, setSection] = useState("");
  const [results, setResults] = useState([]);
  const [output, setOutput] = useState("");

  // 🔍 SEARCH
  const handleSearch = async () => {
    try {
      const res = await API.post("/api/pending/search",  {
        fileNo,
        section,
      });

      if (!res.data || res.data.length === 0) {
        setOutput("❌ No pending files found");
        setResults([]);
        return;
      }

      setResults(res.data);

      let text = "";
      res.data.forEach((r, index) => {
        text += `
S.No: ${index + 1}
Inward No: ${r.inward_no}
Section: ${r.section}
Seat No: ${r.seat_no}
File No: ${r.file_no}
Subject: ${r.subject}
File Status: ${r.file_name}
Year: ${new Date(r.inward_date).getFullYear()}
Inward Date: ${new Date(r.inward_date).toLocaleDateString()}
------------------------------------------------------------\n`;
      });

      setOutput(text);
    } catch (error) {
      console.error(error);
      setOutput("⚠️ Error fetching pending files");
    }
  };

  // 👁️ VIEW
  const handleView = async () => {
    if (results.length === 0) return alert("Search first!");
    const inwardNo = results[0].inward_no;

    try {
     const res = await API.get(`/api/inward/view/${inwardNo}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      window.open(url, "_blank");
    } catch {
      alert("⚠️ File not available");
    }
  };

  // ⬇ DOWNLOAD
  const handleDownload = async () => {
    if (results.length === 0) return alert("Search first!");
    const inwardNo = results[0].inward_no;
    const fileName = results[0].file_no || "file";

    try {
      const res = await API.get(`/api/inward/download/${inwardNo}`,  {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("⚠️ Error downloading file");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="pf-acc-container">

      <h2 className="pf-acc-heading">PENDING FILES</h2>
      <h3 className="pf-acc-subheading">Accounts Branch</h3>

      <div className="pf-acc-box">
        <div className="pf-acc-row">
          <label>File No:</label>
          <input
            type="text"
            value={fileNo}
            onChange={(e) => setFileNo(e.target.value)}
            className="pf-acc-input"
          />
        </div>

        <div className="pf-acc-row">
          <label>Section:</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="pf-acc-input"
          >
            <option value="">Select Section</option>
            <option value="CP Camp">CP Camp</option>
                  <option value="Addl.CP L&O">Addl.CP L&O</option>
                  <option value="Addl.CP Crimes & SIT">Addl.CP Crimes & SIT</option>
                  <option value="Jt.CP SB">Jt.CP SB</option>
                  <option value="Jt.CP CAR">Jt.CP CAR</option>
                  <option value="Jt.CP Traffic">Jt.CP Traffic</option>
                  <option value="Jt.CP DD">Jt.CP DD</option>
                  <option value="CADO">CADO</option>
                  <option value="ADO">ADO</option>
                  <option value="JAO-I Admin">JAO-I Admin</option>
                  <option value="JAO-II Admin">JAO-II Admin</option>
                  <option value="JAO Co-ordi">JAO Co-ordi</option>
                  <option value="A">A</option>
                  <option value="Arms1">Arms1</option>
                  <option value="Arms2">Arms2</option>
                  <option value="Arms3">Arms3</option>
                  <option value="Arms4">Arms4</option>
                  <option value="Arms5">Arms5</option>
                  <option value="Arms6">Arms6</option>
                  <option value="Arms7">Arms7</option>
                  <option value="B">B</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="B3">B3</option>
                  <option value="B4">B4</option>
                  <option value="B5">B5</option>
                  <option value="B6">B6</option>
                  <option value="B7">B7</option>
                  <option value="B8">B8</option>
                  <option value="B9">B9</option>
                  <option value="B10">B10</option>
                  <option value="B11">B11</option>
                  <option value="B12">B12</option>
                  <option value="B13">B13</option>
                  <option value="B14">B14</option>
                  <option value="B15">B15</option>
                  <option value="B16">B16</option>
                  <option value="E1">E1</option>
                  <option value="E2">E2</option>
                  <option value="E3">E3</option>
                  <option value="E4">E4</option>
                  <option value="E5">E5</option>
                  <option value="E6">E6</option>
                  <option value="E7">E7</option>
                  <option value="E8">E8</option>
                  <option value="L&O">L&O</option>
                  <option value="L&O1">L&O1</option>
                  <option value="L&O2">L&O2</option>
                  <option value="L&O3">L&O3</option>
                  <option value="L&O4">L&O4</option>
                  <option value="L&O5">L&O5</option>
                  <option value="M">M</option>
                  <option value="M7">M7</option>
                  <option value="N">N</option>
                  <option value="N1">N1</option>
                  <option value="N2">N2</option>
                  <option value="N3">N3</option>
                  <option value="N4">N4</option>
                  <option value="N5">N5</option>
                  <option value="N6">N6</option>
                  <option value="N7">N7</option>
                  <option value="R&T">R&T</option>
                  <option value="R&T1">R&T1</option>
                  <option value="R&T2">R&T2</option>
                  <option value="R&T3">R&T3</option>
                  <option value="R&T4">R&T4</option>
                  <option value="R&T5">R&T5</option>
                  <option value="R&T6">R&T6</option>
                  <option value="R&T7">R&T7</option>
                  <option value="P&R">P&R</option>
                  <option value="P&R1">P&R1</option>
                  <option value="P&R2">P&R2</option>
                  <option value="P&R3">P&R3</option>
                  <option value="P&R4">P&R4</option>
                  <option value="P&R5">P&R5</option>
                  <option value="P&R6">P&R6</option>
                  <option value="T&L1">T&L1</option>
                  <option value="T&L2">T&L2</option>
                  <option value="T&L3">T&L3</option>
                  <option value="T&L4">T&L4</option>
                  <option value="T&L5">T&L5</option>
                  <option value="T&L6">T&L6</option>
                  <option value="T&L7">T&L7</option>
                  <option value="T&L8">T&L8</option>
                  <option value="W">W</option>
                  <option value="W1">W1</option>
                  <option value="W2">W2</option>
                  <option value="W3">W3</option>
                  <option value="W4">W4</option>
                  <option value="W5">W5</option>
                  <option value="IT Cell">IT Cell</option>
                  <option value="DCP IT cell">DCP IT cell</option>
                  <option value="LA">LA</option>
                  <option value="e-Challan">e-Challan</option>
                  <option value="SC Section">SC Section</option>
                  <option value="ACP-Office i/c CP Office Building">ACP-Office i/c CP Office Building</option>
                  <option value="SR-I">SR-I</option>
                  <option value="SR-II">SR-II</option>
                  <option value="E&B1">E&B1</option>
                  <option value="E&B2">E&B2</option>
                  <option value="E&B3">E&B3</option>
                  <option value="E&B4">E&B4</option>
                  <option value="E&B5">E&B5</option>
                  <option value="E&B6">E&B6</option>
                  <option value="E&B7">E&B7</option>
                  <option value="AAO">AAO</option>
                  <option value="CAO">CAO</option>
                  <option value="Co-operative">Co-operative</option>
                  <option value="DCP E/Z">DCP E/Z</option>
                  <option value="DCP C/Z">DCP C/Z</option>
                  <option value="DCP W/Z">DCP W/Z</option>
                  <option value="DCP S/Z">DCP S/Z</option>
                  <option value="DCP N/Z">DCP N/Z</option>
                  <option value="DCP SEZ">DCP SEZ</option>
                  <option value="DCP SWZ">DCP SWZ</option>
                  <option value="HRMS">HRMS</option>
                  <option value="SMIT">SMIT</option>
                  <option value="DCP ICCC">DCP ICCC</option>
                  <option value="Commandant HGs">Commandant HGs</option>
                  <option value="Stores">Stores</option>
                  <option value="S1">S1</option>
                  <option value="Recruitment Sec">Recruitment Sec</option>
                  <option value="Addl.DCP">Addl.DCP</option>
                  <option value="Parliament Cell">Parliament Cell</option>
                  <option value="Recruitment Cell">Recruitment Cell</option>
                  <option value="Assembly Cell">Assembly Cell</option>
                  <option value="Election Cell">Election Cell</option>
                  <option value="Communication Insp">Communication Insp</option>
                  <option value="Communication">Communication</option>
                  <option value="Planning Sec">Planning Sec</option>
                  <option value="Plg-1">Plg-1</option>
                  <option value="Plg">Plg</option>
                  <option value="Legal">Legal</option>
                  <option value="TGiCCC">TGiCCC</option>

          </select>
        </div>

        <div className="pf-acc-button-row">
          <button className="pf-acc-search-btn" onClick={handleSearch}>Search</button>
          <button className="pf-acc-view-btn" onClick={handleView}>View</button>
          <button className="pf-acc-download-btn" onClick={handleDownload}>Download</button>
        </div>
      </div>

      <textarea className="pf-acc-textarea" value={output} readOnly></textarea>

      <button className="pf-acc-print-btn" onClick={handlePrint}>PRINT</button>

    </div>
  );
};

export default PendingFilesAccounts;
