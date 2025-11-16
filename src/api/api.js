// src/api/api.js
import axios from "axios";

// ===========================================================
// 1. API BASE URL
// ===========================================================
// If REACT_APP_API_BASE is not provided, it will fallback to FastAPI's default port 5000
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// FastAPI endpoints are prefixed with "/api"
const API_URL = `${API_BASE}/api`;

// ===========================================================
// 2. AXIOS INSTANCE
// ===========================================================
const api = axios.create({
    baseURL: API_URL,
});

// ===========================================================
// 3. ATTACH AUTH TOKEN TO EVERY REQUEST
// ===========================================================
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// ===========================================================
// 4. AUTH APIs (FastAPI-compatible)
// ===========================================================
export const apiSignUp = async (data) => {
    return api.post("/auth/signup", data);
};

export const apiLogin = async (data) => {
    return api.post("/auth/login", data);
};

export const getProfile = async () => {
    return api.get("/users/me");
};

// ===========================================================
// 5. PREDICTION UPLOAD API (FastAPI-compatible)
// ===========================================================
export const apiUpload = async (formData) => {
    return api.post("/predictions/predict", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllPredictions = async () => {
    return api.get("/predictions");
};

// ===========================================================
// 6. EXPORT DEFAULT API INSTANCE
// ===========================================================
export default api;
