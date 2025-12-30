



import React, { useState } from "react";
import "../styles/PrintTapal.css";
import API from "../config/api";



const PrintTapal = () => {
  const [outwardFromNo, setOutwardFromNo] = useState("");
  const [outwardToNo, setOutwardToNo] = useState("");
  const [printData, setPrintData] = useState([]);

  const handleSubmit = async () => {
    try {
      const res = await API.post("/api/tapal/print", {
        outwardFromNo,
        outwardToNo,
      });
      setPrintData(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching Tapal to print.");
    }
  };

 // Download button
const handleDownload = async () => {
  if (!outwardFromNo || !outwardToNo) {
    alert("Please enter both From and To numbers");
    return;
  }

  try {
    const res = await API.post(
        "/api/tapal/print/download",
        { outwardFromNo, outwardToNo },
        { responseType: "blob" }
      );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Tapal.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download Error:", err);
    alert("Error downloading Excel file. Check console for details.");
  }
};

  const convertToTable = () => {
    if (!printData.length) return "No records found.";

    let text =
      "INWARD NO | SUBJECT | RECEIVED FROM | REF NO | REF DATE | TAPAL DATE\n";
    text += "-----------------------------------------------------------------------\n";

    printData.forEach((r) => {
      text += `${r.inward_no} | ${r.subject} | ${r.received_from} | ${r.reference_no} | ${r.reference_date} | ${r.date}\n`;
    });

    return text;
  };

  return (
    <div className="printtapal-page">
      <div className="printtapal-container">
        <h2 className="printtapal-title">TAPAL</h2>
        <h3 className="printtapal-subtitle">Print Tapal</h3>

        <div className="printtapal-box">
          <div className="printtapal-form">
            <div className="printtapal-form-row">
              <div className="printtapal-group">
                <label>Outward From No.</label>
                <input
                  type="text"
                  className="printtapal-input"
                  value={outwardFromNo}
                  onChange={(e) => setOutwardFromNo(e.target.value)}
                />
              </div>
              <div className="printtapal-group">
                <label>Outward To No.</label>
                <input
                  type="text"
                  className="printtapal-input"
                  value={outwardToNo}
                  onChange={(e) => setOutwardToNo(e.target.value)}
                />
              </div>
              <button className="printtapal-submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>

        <textarea
          className="printtapal-textarea"
          value={convertToTable()}
          readOnly
        ></textarea>

        <div className="printtapal-btn-group">
          <button className="printtapal-download-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintTapal;
