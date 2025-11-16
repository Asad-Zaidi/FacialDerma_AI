// src/api/api.js
import axios from "axios";

// 🔗 Base URL (Local OR Production)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE + "/api",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 Attach token dynamically
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// 📸 Upload (for Analysis.jsx)
export const apiUpload = async (url, file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};

export default api;
