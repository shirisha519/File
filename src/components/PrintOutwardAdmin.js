



import React, { useState } from "react";
import API from "../config/api";
import "../styles/PrintOutwardAdmin.css";



const PrintOutwardAdmin = () => {
  const [fromNo, setFromNo] = useState("");
  const [toNo, setToNo] = useState("");
  const [note, setNote] = useState("");

  // Track selected row files
  const [selectedOutward, setSelectedOutward] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileIndex, setFileIndex] = useState(0);

  // Format table for textarea
  const formatTable = (rows) => {
    const pad = (text, width) =>
      String(text || "")
        .replace(/\n/g, " ")
        .substring(0, width)
        .padEnd(width, " ");

    const fixDate = (d) => {
      if (!d) return "";
      const dt = new Date(d);
      return dt.toISOString().split("T")[0];
    };

    let text = "OUTWARD ADMIN REPORT\n\n";

    const w = {
      no: 12, date: 12, inward: 12, office: 15, section: 12,
      seat: 6, year: 6, file: 10, received: 18, dispatch: 18,
      category: 12, status: 10, subject: 20, remarks: 20, filepath: 30
    };

    // Header
    text +=
      pad("Outward No", w.no) +
      pad("Date", w.date) +
      pad("Inward No", w.inward) +
      pad("Office", w.office) +
      pad("Section", w.section) +
      pad("Seat", w.seat) +
      pad("Year", w.year) +
      pad("File No", w.file) +
      pad("Received From", w.received) +
      pad("Dispatch To", w.dispatch) +
      pad("Category", w.category) +
      pad("Status", w.status) +
      pad("Subject", w.subject) +
      pad("Remarks", w.remarks) +
      pad("File Path", w.filepath) +
      "\n";

    text += "-".repeat(230) + "\n";

    // Rows
    rows.forEach((r) => {
      const files = r.file_path && r.file_path.length > 0
        ? r.file_path.map(f => f.split("/").pop()).join(", ")
        : "No files";
      text +=
        pad(r.outward_no, w.no) +
        pad(fixDate(r.outward_date), w.date) +
        pad(r.inward_no, w.inward) +
        pad(r.office, w.office) +
        pad(r.section, w.section) +
        pad(r.seat_no, w.seat) +
        pad(r.year, w.year) +
        pad(r.file_no, w.file) +
        pad(r.received_from, w.received) +
        pad(r.dispatch_to, w.dispatch) +
        pad(r.category, w.category) +
        pad(r.file_status, w.status) +
        pad(r.subject, w.subject) +
        pad(r.remarks, w.remarks) +
        pad(files, w.filepath) +
        "\n";
    });

    return text;
  };

  // Fetch range
  const handleSubmit = async () => {
    try {
      const res = await API.get("/api/outward/range", {
        params: { fromNo, toNo },
      });

      const data = res.data;
      if (!data.length) {
        alert("No data found");
        setSelectedFiles([]);
        setSelectedOutward(null);
        setNote("");
        return;
      }

      // Auto-select first row
      const firstRow = data[0];
      const files = firstRow.file_path || [];
      setSelectedOutward(firstRow.outward_no);
      setSelectedFiles(files);
      setFileIndex(0);

      setNote(formatTable(data));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
  };

  // View selected file
  const handleView = async () => {
    if (!selectedOutward || !selectedFiles.length) {
      alert("No files available for this record");
      return;
    }

    try {
      const res = await API.get(
        `/api/outward/view/${selectedOutward}?index=${fileIndex}`,
        { responseType: "blob" }
      );
      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      window.open(fileURL, "_blank");

      // Cycle to next file
      setFileIndex(prev => (prev + 1) % selectedFiles.length);
    } catch (err) {
      console.error(err);
      alert("Error viewing file");
    }
  };

  // Download Excel
  const handleDownload = async () => {
    try {
      const res = await API.post(
        "/api/outward/export",
        { fromNo, toNo },
        { responseType: "blob" }
      );
       const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "outward.xlsx";
      link.click();
    } catch (err) {
      alert("Download failed");
    }
  };

  // Print
  const handlePrint = () => window.print();

  return (
    <div className="pa-container">
      <h2 className="pa-title">Outward Admin</h2>

      <div className="pa-box">
        <label>Outward From No</label>
        <input type="text" value={fromNo} onChange={(e) => setFromNo(e.target.value)} />
        <label>Outward To No</label>
        <input type="text" value={toNo} onChange={(e) => setToNo(e.target.value)} />
        <button className="pa-submit" onClick={handleSubmit}>SUBMIT</button>

        <div className="pa-btn-area">
          <button className="pa-view" onClick={handleView}>VIEW</button>
          <button className="pa-download" onClick={handleDownload}>DOWNLOAD</button>
        </div>
      </div>

      <textarea className="pa-textarea" value={note} onChange={(e) => setNote(e.target.value)} />

      <button className="pa-print" onClick={handlePrint}>PRINT</button>
    </div>
  );
};

export default PrintOutwardAdmin;
