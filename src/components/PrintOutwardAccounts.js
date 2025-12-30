




import React, { useState } from "react";
import API from "../config/api";
import "../styles/PrintOutwardAccounts.css";



const PrintOutwardAccounts = () => {
  const [fromAcc, setFromAcc] = useState("");
  const [toAcc, setToAcc] = useState("");
  const [notesAcc, setNotesAcc] = useState("");

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

    let text = "OUTWARD ACCOUNTS REPORT\n\n";

    const w = {
      no: 12, date: 12, inward: 12, office: 15, section: 12,
      seat: 6, year: 6, file: 10, received: 18, dispatch: 18,
      category: 12, status: 10, subject: 20, remarks: 20, filepath: 30
    };

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
        params: { fromNo: fromAcc, toNo: toAcc },
      });


      const data = res.data;
      if (!data.length) {
        alert("No data found");
        setSelectedFiles([]);
        setSelectedOutward(null);
        setNotesAcc("");
        return;
      }

      // Auto-select first row
      const firstRow = data[0];
      const files = firstRow.file_path || [];
      setSelectedOutward(firstRow.outward_no);
      setSelectedFiles(files);
      setFileIndex(0);

      setNotesAcc(formatTable(data));
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
        { fromNo: fromAcc, toNo: toAcc },
        { responseType: "blob" }
      );
        const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "outward_accounts.xlsx";
      link.click();
    } catch (err) {
      alert("Download failed");
    }
  };

  // Print
  const handlePrint = () => window.print();

  return (
    <div className="pacc-wrapper">
      <h2 className="pacc-title">Outward Accounts</h2>
      <h3 className="pacc-subtitle">Print Outward Accounts Branch</h3>

      <div className="pacc-box">
        <label>Outward From No</label>
        <input type="text" value={fromAcc} onChange={(e) => setFromAcc(e.target.value)} />

        <label>Outward To No</label>
        <input type="text" value={toAcc} onChange={(e) => setToAcc(e.target.value)} />

        <button className="pacc-submit" onClick={handleSubmit}>SUBMIT</button>

        <div className="pacc-btn-area">
          <button className="pacc-view" onClick={handleView}>VIEW</button>
          <button className="pacc-download" onClick={handleDownload}>DOWNLOAD</button>
        </div>
      </div>

      <textarea className="pacc-textbox" value={notesAcc} onChange={(e) => setNotesAcc(e.target.value)} />

      <button className="pacc-print" onClick={handlePrint}>PRINT</button>
    </div>
  );
};

export default PrintOutwardAccounts;
