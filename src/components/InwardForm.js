




import React, { useEffect, useState,useRef } from "react";
import "../styles/InwardForm.css";
import API from "../config/api";

const InwardForm = () => {
  const [inwardNo, setInwardNo] = useState("");
  const [fileInputs, setFileInputs] = useState([]);
  const hiddenFileInput = useRef(null);
  const [formData, setFormData] = useState({
    office: "",
    section: "",
    seatNo: "",
    fileNo: "",
    year: "",
    receivedFrom: "",
    to: "",
    subject: "",
    category: "",
     fileStatus: "", 
    remarks: "",
    date:""  
     // ✅ Auto-fill today
   
  });

  // ✅ FETCH NEXT AUTO INWARD NUMBER
  useEffect(() => {
  const fetchInwardNo = async () => {
    try {
      const res = await API.get("/api/inward/next-inward-no");
      setInwardNo(res.data.inwardNo); // if you still want separate state
      setFormData(prev => ({ ...prev, inward_no: res.data.inwardNo })); // ensure submission includes it
    } catch (err) {
      console.error("Error fetching next inward no:", err);
    }
  };
  fetchInwardNo();
}, []);

  // HANDLE CHANGE
 const handleChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};
 const handleChooseFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputs([...fileInputs, { id: Date.now(), file }]);
    }
    e.target.value = null; // allow selecting same file again
  };

  // -----------------------
  // + Button → Click hidden input
  // -----------------------
  const handleAddClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();

    formPayload.append("inward_no", inwardNo);
    formPayload.append("inward_date", formData.date);
    formPayload.append("office", formData.office);
    formPayload.append("section", formData.section);
    formPayload.append("seat_no", formData.seatNo);
    formPayload.append("file_no", formData.fileNo);
    formPayload.append("year", formData.year);
    formPayload.append("received_from", formData.receivedFrom);
    formPayload.append("to_person", formData.to);
    formPayload.append("category", formData.category);
    formPayload.append("file_status", formData.fileStatus);
    formPayload.append("subject", formData.subject);
    formPayload.append("remarks", formData.remarks);

    fileInputs.forEach(f => {
        formPayload.append("documents", f.file);
      });

    try {
      const response = await API.post(
        "/api/inward",
        formPayload
      );

       alert(`Inward Number ${response.data.data.inward_no} created successfully✔`);

      // Fetch next auto number
      const newNoRes = await API.get(
        "/api/inward/next-inward-no"
      );
      setInwardNo(newNoRes.data.inward_no);
      setFormData(prev => ({ ...prev, office:"", section:"", seatNo:"", fileNo:"", year:"", receivedFrom:"", to:"", category:"", fileStatus:"", subject:"", remarks:"", date: new Date().toISOString().split("T")[0] }));
      setFileInputs([]);
      
    } catch (error) {
      console.error(error);
      alert("Submission failed. Check console.");
    }
  };

  const handleClear = () => {
    setFormData({
      office: "",
      section: "",
      seatNo: "",
      fileNo: "",
      year: "",
      receivedFrom: "",
      to: "",
      subject: "",
      category: "",
      fileStatus:"",
      remarks: "",
      date: new Date().toISOString().split("T")[0], // reset date
    
    });
 setFileInputs([]);
  };
  return (
    <div className="inward-form-page">
      <h2 className="form-title">INWARD</h2>
      <h2 className="sub-title">New Receipts Admin Branch</h2>

      <form className="inward-form" onSubmit={handleSubmit}>
        {/* Top Row */}
        <div className="top-row">
          <div className="form-group left">
            <label>Inward No:</label>
            <input type="text" value={inwardNo} readOnly />
          </div>

          <div className="form-group right">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Form fields in label-left / input-right style */}
        <div className="form-row">
          <label>Office:</label>
          <select name="office" value={formData.office} onChange={handleChange} required>
            <option value="">-- Select Office --</option>
            <option value="CP Office">Admin</option>
          </select>
        </div>

        {formData.office === "CP Office" && (
          <div className="form-row">
            <label>Section:</label>
            <select name="section" value={formData.section} onChange={handleChange} required>
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
          <input
            type="text"
            name="seatNo"
            value={formData.seatNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>File No:</label>
          <input
            type="text"
            name="fileNo"
            value={formData.fileNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Year:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="2000"
            max="2100"
          />
        </div>

        <div className="form-row">
          <label>Received From:</label>
          <select
            name="receivedFrom"
            value={formData.receivedFrom}
            onChange={handleChange}
            required
          >
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

        <div className="form-row">
          <label>To:</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            <option value="Confidential">Confidential</option>
            <option value="Non-Confidential">Non-Confidential</option>
          </select>
        </div>
                 <div className="form-row">
              <label>File Status:</label>
              <select
                name="fileStatus"
                value={formData.fileStatus || ""}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="InProgress">In Progress</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>


        <div className="form-row">
          <label>Subject:</label>
          <textarea
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="form-row">
          <label>Remarks:</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* Dynamic File Upload */}

          {/* Upload Document Section */}
    <div className="form-row file-upload-section">
          <label>Upload Document:</label>

          <div className="upload-box">
            {/* Hidden actual file input */}
            <input
              type="file"
              ref={hiddenFileInput}
              style={{ display: "none" }}
              onChange={handleChooseFile}
            />

            {/* Visible Choose File */}
            <input
              type="file"
              className="file-input"
              onChange={handleChooseFile}
            />

            {/* + Button */}
            <button
              type="button"
              className="add-file-btn"
              onClick={handleAddClick}
            >
              ➕
            </button>
          </div>

          {/* Show selected files below */}
          <div className="selected-files-list">
            {fileInputs.map((f) => {
              if (!f.file) return null;

              return (
                <div key={f.id} className="file-row">
                  <span className="file-name">{f.file.name}</span>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      setFileInputs(
                        fileInputs.filter((item) => item.id !== f.id)
                      )
                    }
                  >
                    ❌
                  </button>
                </div>
              );
            })}
          </div>
        </div>

 
 



        <div className="form-buttons">
          <button type="submit" className="submit-btn">SUBMIT</button>
          <button type="button" className="clear-btn" onClick={handleClear}>CLEAR</button>
        </div>
      </form>
    </div>
  );
};

export default InwardForm;
