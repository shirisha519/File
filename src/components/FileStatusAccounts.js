


import React, { useState } from "react";
import API from "../config/api";
import "../styles/FileStatusAccounts.css";



const FileStatusAccounts = () => {
  const [section, setSection] = useState("");
  const [seatNo, setSeatNo] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [fromOW, setFromOW] = useState("");
  const [toOW, setToOW] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [subject, setSubject] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected row

  // ---------------- FORMAT TABLE ----------------
  const formatTable = (rows) => {
    const pad = (text, width) =>
      String(text || "").replace(/\n/g, " ").substring(0, width).padEnd(width, " ");

    const fixDate = (d) => {
      if (!d) return "";
      const dt = new Date(d);
      return dt.toISOString().split("T")[0];
    };

    let text = "FILE STATUS REPORT\n\n";

    const w = {
      inward: 12,
      section: 12,
      seat: 8,
      file: 10,
      subject: 25,
      from: 12,
      to: 12,
      remarks: 20,
      filepath: 35,
    };

    // Header
    text +=
      pad("Inward No", w.inward) +
      pad("Section", w.section) +
      pad("Seat No", w.seat) +
      pad("File No", w.file) +
      pad("Subject", w.subject) +
      pad("From Date", w.from) +
      pad("To Date", w.to) +
      pad("Remarks", w.remarks) +
      pad("File Path", w.filepath) +
      "\n";

    text += "-".repeat(170) + "\n";

    // Rows
    rows.forEach((r) => {
      const files =
        r.file_path && r.file_path.length > 0
          ? r.file_path.map((f) => f.split("/").pop()).join(", ")
          : "No files";

      text +=
        pad(r.inward_no, w.inward) +
        pad(r.section, w.section) +
        pad(r.seat_no, w.seat) +
        pad(r.file_no, w.file) +
        pad(r.subject, w.subject) +
        pad(fixDate(r.from_date), w.from) +
        pad(fixDate(r.to_date), w.to) +
        pad(r.remarks, w.remarks) +
        pad(files, w.filepath) +
        "\n";
    });

    return text;
  };

  // ---------------- SEARCH ----------------
  const handleSearch = async () => {
    try {
      const res = await API.post("/api/file/search", {
        section,
        seatNo,
        fileNo,
        subject,
        inwardNoFrom: fromOW,
        inwardNoTo: toOW,
        fromDate,
        toDate,
      });

      if (!res.data || res.data.length === 0) {
        alert("❌ No records found");
        setResults([]);
        setSelectedIndex(null);
        return;
      }

      setResults(res.data);
      setSelectedIndex(null);
    } catch (err) {
      console.error("Search Error:", err);
      alert("⚠️ Error fetching data from server");
    }
  };

  // ---------------- VIEW FILE ----------------
  const handleViewFile = () => {
    if (selectedIndex === null) return alert("Select a row first!");

    const row = results[selectedIndex];
    if (!row || !row.file_path?.[0]) return alert("Selected row has no file");

    window.open(
      `${process.env.REACT_APP_API_BASE_URL}/api/file/view/${row.id}/0`,
      "_blank"
    );
  };

  // ---------------- DOWNLOAD EXCEL ----------------
  const handleDownloadFile = async () => {
    try {
     const res = await API.post(
        "/api/file/export",
        {
          section,
          seatNo,
          fileNo,
          subject,
          outwardFrom: fromOW,
          outwardTo: toOW,
          fromDate,
          toDate,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file_status_accounts.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Excel download failed");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="fsa-container">
      <h2 className="fsa-title">FILE STATUS</h2>
      <h3 className="fsa-subtitle">Accounts Branch</h3>

      <div className="fsa-box">
        <div className="fsa-row">
          <label>Section:</label>
          <select className="fsa-select" value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">Select</option>
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

          <label>From OW:</label>
          <input className="fsa-input-small" value={fromOW} onChange={(e) => setFromOW(e.target.value)} />
          <label>To OW:</label>
          <input className="fsa-input-small" value={toOW} onChange={(e) => setToOW(e.target.value)} />
        </div>

        <div className="fsa-row">
          <label>Seat No:</label>
          <input className="fsa-input-small" value={seatNo} onChange={(e) => setSeatNo(e.target.value)} />

          <label>File No:</label>
          <input className="fsa-input-small" value={fileNo} onChange={(e) => setFileNo(e.target.value)} />

          <label>From Date:</label>
          <input type="date" className="fsa-input-small" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />

          <label>To Date:</label>
          <input type="date" className="fsa-input-small" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <div className="fsa-row">
          <label>Subject:</label>
          <input className="fsa-input-wide" value={subject} onChange={(e) => setSubject(e.target.value)} />

          {/* One-time buttons */}
          <button className="fsa-search-btn" onClick={handleSearch}>Search</button>
          <button className="fsa-view-btn" onClick={handleViewFile}>View</button>
          <button className="fsa-download-btn" onClick={handleDownloadFile}>Download</button>
        </div>
      </div>

      {/* Result textarea */}
      <textarea
        className="fsa-output-box"
        readOnly
        value={formatTable(results)}
        onClick={(e) => {
          const lineHeight = 18;
          const clickY = e.nativeEvent.offsetY;
          const rowIndex = Math.floor(clickY / lineHeight) - 3; // adjust for header
          if (rowIndex >= 0 && rowIndex < results.length) setSelectedIndex(rowIndex);
        }}
      ></textarea>

      <button className="fsa-print-btn" onClick={handlePrint}>PRINT</button>
    </div>
  );
};

export default FileStatusAccounts;
