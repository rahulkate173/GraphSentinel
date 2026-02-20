import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api.js";
import "./InputPage.scss";

const InputPage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = selectedFile => {
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv") {
      setStatus("Only .csv files are allowed");
      return;
    }

    setFile(selectedFile);
    setStatus("File ready to upload");
  };

  const handleDrop = e => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    setLoading(true);
    setStatus("Uploading and analyzing...");

    try {
      await apiClient.analyzeAnomalies(file);
      setStatus("Analysis complete! Redirecting to results...");
      setTimeout(() => navigate("/graph"), 1200);
    } catch (err) {
      setStatus(err.message || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="input-wrapper">
        <img className='img'src="/filebg.png" alt="" />
      <div
        className="drop-zone"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p>Drag & Drop CSV File Here</p>
        <p>or</p>

        <label className="file-btn">
          Select CSV File
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={e => handleFile(e.target.files[0])}
          />
        </label>

        {file && <p className="file-name">{file.name}</p>}
      </div>
      <button className="upload-btn" onClick={handleUpload}>
        Upload 

      </button>

      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default InputPage;
