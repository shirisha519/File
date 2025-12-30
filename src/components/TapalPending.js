


import React, { useState } from "react";
import "../styles/TapalPending.css";
import API from "../config/api";



const TapalPending = () => {
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    receivedFrom: "",
    referenceNo: "",
    inwardNumber: "",
    fromDate: "",
    toDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   const convertToTable = () => {
    if (!results.length) return "No records found.";

    let text =
      "INWARD NO | SUBJECT | RECEIVED FROM | REF NO | REF DATE | TAPAL DATE\n";
    text += "-----------------------------------------------------------------------\n";

    results.forEach((r) => {
      text += `${r.inward_no} | ${r.subject} | ${r.received_from} | ${r.reference_no} | ${r.reference_date} | ${r.date}\n`;
    });

    return text;
  };

 const handleSearch = async () => {
  try {
   const res = await API.post("/api/tapal/pending", formData);
    setResults(res.data);
  } catch (err) {
    console.error(err);
    alert("Error fetching pending tapals.");
  }
};

const handleDownload = async () => {
  try {
     const res = await API.post(
        "/api/tapal/pending/download",
        formData,
        { responseType: "blob" }
      );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pending_tapal.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert("Error downloading Excel file");
  }
};




 const handleRangeSearch = async () => {
  try {
     const res = await API.post("/api/tapal/pendingRange", formData);
    alert("Pending tapals for date range fetched. Check console.");
    console.log(res.data);
  } catch (err) {
    console.error(err);
    alert("Error fetching pending tapals by date range.");
  }
};
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tapal-pending-page">
    <div className="pending-container">
      <h2 className="pending-title">TAPAL Tracking System</h2>
      <h3 className="pending-subtitle">TAPAL Pending</h3>

      {/* MAIN SEARCH BOX */}
      <div className="pending-box">
        <div className="pending-grid">
          {/* LEFT COLUMN */}
          <div className="pending-left">
            <div className="pending-field">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="pending-field">
              <label>Received From:</label>
              <input
                type="text"
                name="receivedFrom"
                value={formData.receivedFrom}
                onChange={handleChange}
              />
            </div>

            <div className="pending-field">
              <label>Reference No:</label>
              <input
                type="text"
                name="referenceNo"
                value={formData.referenceNo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* CENTER OR */}
          <div className="pending-or">
            <span>OR</span>
          </div>

          {/* RIGHT COLUMN */}
          <div className="pending-right">
            <div className="pending-field">
              <label>Inward Number:</label>
              <input
                type="text"
                name="inwardNumber"
                value={formData.inwardNumber}
                onChange={handleChange}
              />
            </div>
            <button onClick={handleSearch} className="pending-search-btn">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* DATE RANGE BOX */}
      <div className="pending-box">
        <div className="pending-range">
          <label className="pending-range-label">Tapal Reference Date Range:</label>
          <label>From:</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
          />
          <label>To:</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
          />
          <button onClick={handleRangeSearch} className="pending-small-btn">
            Search
          </button>
        </div>
      </div>

      {/* RESULT BOX + PRINT */}
      <textarea
        className="pending-result-box"
        value={convertToTable()}
      ></textarea>

      <div className="pending-print-container">
       <button className="pending-download-btn" onClick={handleDownload}>
            Download
          </button>
        <button className="pending-print-btn" onClick={handlePrint}>
          Print
        </button>
      </div>
    </div>
    </div>
  );
};

export default TapalPending;
