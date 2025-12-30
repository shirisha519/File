


import React, { useState } from "react";
import API from "../config/api";
import { useNavigate } from "react-router-dom";
import "../styles/InwardSearch.css";

const InwardSearch = () => {
  const navigate = useNavigate();
const [fileIndex, setFileIndex] = useState(0);

  const [criteria, setCriteria] = useState({
    inward_no: "",
    file_no: "",
    office: "",
    section: "",
    seat_no: "",
    received_from: "",
    subject: "",
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    receivedFromDate: new Date().toISOString().split("T")[0],
    receivedToDate: new Date().toISOString().split("T")[0],
  });

  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  // -----------------------------------
  // HANDLE CHANGE
  // -----------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "office") {
      setCriteria((prev) => ({
        ...prev,
        section: "",
      }));
    }
  };

  
 // -----------------------------------
// SEARCH
// -----------------------------------
       const handleSearch = async () => {
  try {
    const payload = {};

    // 🔥 PRIORITY SEARCH: inward_no EXACT search
    if (criteria.inward_no.trim()) {
      payload.inward_no = criteria.inward_no.trim();
    }

    // 🔥 PRIORITY SEARCH: file_no EXACT search
    if (criteria.file_no.trim()) {
      payload.file_no = criteria.file_no.trim();
    }

    // ❌ DO NOT SEND fromDate / toDate when file_no or inward_no is searched
    if (!criteria.inward_no && !criteria.file_no) {
      if (criteria.fromDate) payload.fromDate = criteria.fromDate;
      if (criteria.toDate) payload.toDate = criteria.toDate;
    }

    if (criteria.office) payload.office = criteria.office;
    if (criteria.section) payload.section = criteria.section;
    if (criteria.seat_no.trim()) payload.seat_no = criteria.seat_no.trim();
    if (criteria.received_from) payload.received_from = criteria.received_from;
    if (criteria.subject.trim()) payload.subject = criteria.subject.trim();

   const res = await API.post("/api/inward/search", payload);


    if (!res.data || res.data.length === 0) {
      alert("No results found.");
      setResults([]);
      setSelected(null);
      return;
    }

    setResults(res.data);
    setSelected(res.data[0]);
  } catch (err) {
    console.error(err);
    alert("Search error. Please check your input or try again.");
  }
};

  // -----------------------------------
  // RECEIVED DATE RANGE SEARCH
  // -----------------------------------
  const handleReceivedDateSearch = async () => {
    try {
      const payload = {
        fromDate: criteria.receivedFromDate,
        toDate: criteria.receivedToDate,
      };

     const res = await API.post("/api/inward/search", payload);


      setResults(res.data);
      setSelected(res.data.length > 0 ? res.data[0] : null);

      if (res.data.length === 0) alert("No results found.");
    } catch (err) {
      console.error(err);
      alert("Date range search error");
    }
  };

  // -----------------------------------
  // VIEW FILE
  // -----------------------------------
  // ------------------------------
// VIEW FILE (supports index)
// ------------------------------
const handleViewFile = async () => {
  if (!selected || !selected.file_path || selected.file_path.length === 0)
    return alert("No files available");

  const files = selected.file_path;
  const inwardNo = selected.inward_no;

  try {
   const res = await API.get(
  `/api/inward/view/${inwardNo}?index=${fileIndex}`,
  { responseType: "blob" }
);

    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    window.open(fileURL, "_blank");

    // 🔁 Move to next file (loop)
    setFileIndex((prev) => (prev + 1) % files.length);
  } catch (err) {
    console.error(err);
    alert("Error while viewing the file!");
  }
};


// ------------------------------
// DOWNLOAD FILE (supports index)
// ------------------------------
const handleDownloadFile = async () => {
  if (!selected || !selected.file_path || selected.file_path.length === 0)
    return alert("No files to download");

  const files = selected.file_path;
  const inwardNo = selected.inward_no;

  try {
    for (let i = 0; i < files.length; i++) {
      const res = await API.get(
  `/api/inward/download/${inwardNo}?index=${i}`,
  { responseType: "blob" }
);


      const blob = new Blob([res.data]);
      const link = document.createElement("a");

      const fileName = files[i].split("/").pop();
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;

      link.click();
    }
  } catch (err) {
    console.error(err);
    alert("Error downloading files!");
  }
};

  // -----------------------------------
  // REPLY
  // -----------------------------------
  const handleReply = () => {
  navigate("/InwardForm"); // just navigate, no data
};

  // -----------------------------------
  // SAVE TO OUTWARD
  // -----------------------------------
 // -----------------------------------
// SAVE TO OUTWARD
// -----------------------------------
const handleSaveOutward = async () => {
  if (!selected) return alert("Select a record first");

  try {
    const payload = {
      inward_no: selected.inward_no,
      outward_no: "",
      outward_date: new Date().toISOString().split("T")[0],
      office: selected.office || "",
      section: selected.section || "",
      seat_no: selected.seat_no || "",
      year: selected.year || "",
      received_from: selected.received_from || "",
      dispatch_to: selected.to_person || "",
      subject: selected.subject || "",
      remarks: selected.remarks || "",
      category: selected.category || "",
      file_no: selected.file_no || "",
      file_status: "Open",

      // ✅ SEND FILE PATHS
      inward_file_paths: selected.file_path || []
    };

   const res = await API.post("/api/outward/save", payload);


    alert(`✔ Outward saved! Outward No: ${res.data.outward_no}`);
  } catch (err) {
    console.error(err);
    alert("❌ Error saving outward");
  }
};


// Safe pad function (prevents null padEnd error)
const pad = (value, len) => {
  return (value ?? "").toString().padEnd(len);
};

  // -----------------------------------
  // RESULTS FORMATTER
  // -----------------------------------
const formatResults = () => {
  if (!results || results.length === 0) return "No results found.";

  let table =
    "+-----------+-----------+-----------+---------+---------+------+----------------+------------+------------+------------------------------+\n" +
    "| Inward No | Office    | Section   | Seat No | File No | Year | Received From | To Person  | FileStatus | Files                        |\n" +
    "+-----------+-----------+-----------+---------+---------+------+----------------+------------+------------+------------------------------+\n";

  results.forEach((row) => {
    const fileStatus = row.file_status || "N/A";

    // FILE LINKS INLINE (NO NEW LINES)
    let fileLinks = "No Files";

    if (Array.isArray(row.file_path) && row.file_path.length > 0) {
      fileLinks = row.file_path
        .map((fp, idx) => {
          const filename = fp.split("/").pop();
          return `${idx + 1}. ${filename} (V:/api/inward/view/${row.inward_no}?index=${idx} | D:/api/inward/download/${row.inward_no}?index=${idx})`;
        })
        .join(", "); // KEEP IN ONE LINE
    }

   table +=
  `| ${pad(row.inward_no, 10)} ` +
  `| ${pad(row.office, 9)} ` +
  `| ${pad(row.section, 9)} ` +
  `| ${pad(row.seat_no, 7)} ` +
  `| ${pad(row.file_no, 7)} ` +
  `| ${pad(row.year, 4)} ` +
  `| ${pad(row.received_from, 14)} ` +
  `| ${pad(row.to_person, 10)} ` +
  `| ${pad(fileStatus, 10)} ` +
  `| ${pad(fileLinks, 28)} |\n`;

  });

  table +=
    "+-----------+-----------+-----------+---------+---------+------+----------------+------------+------------+------------------------------+";

  return table;
};



  return (
    <div className="inward-search-page">
      <div className="inward-search-container">
        <h2 className="form-title">INWARD SEARCH</h2>
        <h2 className="search-sub-title">Search Inward Admin and Account Branch</h2>

        {/* MAIN SEARCH BOX */}
        <div className="search-box">
          <div className="form-row">
            <label>Inward No:</label>
           <input type="text" name="inward_no" value={criteria.inward_no}onChange={handleChange}/>
          </div>

          <div className="form-row">
            <label>Date:</label>
            <input type="date" name="fromDate" value={criteria.fromDate} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Office:</label>
            <select name="office" value={criteria.office} onChange={handleChange}>
              <option value="">-- Select Office --</option>
              <option value="CP Office">Admin & Accounts</option>
            </select>
          </div>

          {criteria.office === "CP Office" && (
            <div className="form-row">
              <label>Section:</label>
              <select name="section" value={criteria.section} onChange={handleChange}>
                <option value="">-- Select Section --</option>
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
          )}

          <div className="form-row">
            <label>Seat No:</label>
            <input type="text" name="seat_no" value={criteria.seat_no} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>File No:</label>
            <input type="text" name="file_no" value={criteria.file_no} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Year:</label>
            <input type="number" name="year" value={criteria.year} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Subject:</label>
            <input type="text" name="subject" value={criteria.subject} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Received From:</label>
            <select name="received_from" value={criteria.received_from} onChange={handleChange}>
              <option value="">-- Select Received From --</option>
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

          <div className="button-section">
            <button onClick={handleSearch} className="search-btn">Search</button>
            <button onClick={handleViewFile} className="search-btn">View</button>
            <button onClick={handleDownloadFile} className="search-btn">Download</button>

          </div>
        </div>

        {/* RECEIVED DATE RANGE BOX */}
        <div className="received-range-box">
          <h3>Received Date Range</h3>
          <div className="range-row">
            <label>From:</label>
            <input type="date" name="receivedFromDate" value={criteria.receivedFromDate} onChange={handleChange} />
            <label>To:</label>
            <input type="date" name="receivedToDate" value={criteria.receivedToDate} onChange={handleChange} />
            <button onClick={handleReceivedDateSearch} className="search-btn">Search</button>
          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="results-box">
          <label>Results:</label>
          <textarea readOnly rows={20} value={formatResults()} />
          <div className="reply-save-buttons" style={{ marginTop: "10px" }}>
            <button onClick={handleReply} className="search-btn">Do you want Reply?</button>
            <button onClick={handleSaveOutward} className="search-btn">Save Outward</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InwardSearch;
