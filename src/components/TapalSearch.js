


import React, { useState } from "react";
import "../styles/TapalSearch.css";
import API from "../config/api"; 




const TapalSearch = () => {
  const [formData, setFormData] = useState({
    subject: "",
    receivedFrom: "",
    referenceNo: "",
    referenceDate: "",
    inwardNumber: "",
    fromDate: "",
    toDate: "",
  });

 const [results, setResults] = useState([]);
  const [textareaText, setTextareaText] = useState("");

  // Convert results to table for textarea
  const formatTable = (rows) => {
    if (!rows || rows.length === 0) return "No records found.";

    let header =
      "+------------+---------------+-------------+--------------+------------+------------+\n" +
      "| Inward No  | Reference No  | Ref Date    | Received From| Subject    | Date       |\n" +
      "+------------+---------------+-------------+--------------+------------+------------+\n";

    let body = rows
      .map((r) => {
        return (
          `| ${String(r.inward_no).padEnd(10)} ` +
          `| ${String(r.reference_no || "").padEnd(13)} ` +
          `| ${String(r.reference_date || "").padEnd(11)} ` +
          `| ${String(r.received_from || "").padEnd(12)} ` +
          `| ${String(r.subject || "").padEnd(10)} ` +
          `| ${String(r.date || "").padEnd(10)} |\n`
        );
      })
      .join("");

    let footer =
      "+------------+---------------+-------------+--------------+------------+------------+\n";

    return header + body + footer;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const res = await API.post("/api/tapal/search", formData);
      setResults(res.data);

      const table = formatTable(res.data);
      setTextareaText(table);
    } catch (err) {
      console.error(err);
      alert("Error fetching search results.");
    }
  };

const handleRangeSearch = async () => {
    try {
     const res = await API.post("/api/tapal/search", formData);

      setResults(res.data);

      const table = formatTable(res.data);
      setTextareaText(table);
    } catch (err) {
      console.error(err);
      alert("Error fetching date range results.");
    }
  };
   const downloadExcel = () => {
    if (results.length === 0) return alert("No data to download.");

    const csvRows = [];

    // Header
    csvRows.push("Inward No,Reference No,Reference Date,Received From,Subject,Date");

    // Rows
    results.forEach((r) => {
      csvRows.push(
        `${r.inward_no},${r.reference_no || ""},${r.reference_date || ""},${r.received_from || ""},${r.subject || ""},${r.date || ""}`
      );
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tapal_search_results.csv";
    a.click();
  };

  const handlePrint = () => window.print();

  return (
    <div className="tapal-search-page">
      <div className="tapal-search-container">
        <h2 className="tapal-search-title">TAPAL Tracking System</h2>
        <h3 className="tapal-search-subtitle">TAPAL Search</h3>

        {/* FIRST SEARCH BOX */}
        <div className="tapal-search-box">
          <div className="tapal-search-grid">

            {/* LEFT SIDE */}
            <div className="tapal-search-left">
              <div className="tapal-search-row">
                <label>Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="tapal-search-row">
                <label>Received From:</label>
                <input
                  type="text"
                  name="receivedFrom"
                  value={formData.receivedFrom}
                  onChange={handleChange}
                />
              </div>

              <div className="tapal-search-row">
                <label>Reference No:</label>
                <input
                  type="text"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleChange}
                />
              </div>

              <div className="tapal-search-row">
                <label>Reference Date:</label>
                <input
                  type="date"
                  name="referenceDate"
                  value={formData.referenceDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* OR CENTER */}
            <div className="tapal-search-or">OR</div>

            {/* RIGHT SIDE */}
            <div className="tapal-search-right">
              <label>Inward Number:</label>
              <input
                type="text"
                name="inwardNumber"
                value={formData.inwardNumber}
                onChange={handleChange}
              />

              <button className="tapal-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* DATE RANGE BOX */}
        <div className="tapal-search-box">
          <div className="tapal-search-range">
            <label className="tapal-search-range-label">
              Tapal Reference Date Range:
            </label>

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

            <button className="tapal-search-small-btn" onClick={handleRangeSearch}>
              Search
            </button>
          </div>
        </div>

        {/* TEXTAREA */}
        <textarea
          className="tapal-search-result"
          value={textareaText}
         
        ></textarea>

        {/* PRINT BUTTON */}
        <div className="tapal-search-print">
           <button className="tapal-search-print-btn" onClick={downloadExcel}>Download</button>
          <button className="tapal-search-print-btn" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default TapalSearch;
