import axios from "axios";

// Create axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Admin Login
export const loginAdmin = async (loginData) => {
  const response = await API.post("/admin/login", loginData);
  return response.data;
};

// Inward
export const getNextInwardNo = async () => {
  const response = await API.get("/inward/next-inward-no");
  return response.data.inwardNo;
};

export const createInward = async (formData) => {
  const response = await API.post("/inward", formData);
  return response.data;
};

export const searchInward = async (searchData) => {
  const response = await API.post("/inward/search", searchData);
  return response.data;
};

// ✅ File Status — Correct and working
export const getFileStatuses = async () => {
  const response = await API.get("/files/statuses");
  return response.data;
};

export const updateFileStatus = async (data) => {
  try {
    const response = await axios.post(`${API}/files/update`, data);
    return response.data;
  } catch (err) {
    console.error("Error updating status", err);
    throw err;
  }
};

// Pending Files
export const getPendingFiles = async () => {
  const response = await API.get("/files/pending");
  return response.data;
};
