// src/api/api.js
import axios from "axios";

// ===========================================================
// 1. API BASE URL
// ===========================================================
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const API_URL = `${API_BASE}/api`;

// ===========================================================
// 2. AXIOS INSTANCE
// ===========================================================
const api = axios.create({
    baseURL: API_URL,
});

// ===========================================================
// 3. ATTACH AUTH TOKEN
// ===========================================================
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// ===========================================================
// 3.5. INTERCEPTOR — HANDLE 401/403
// ===========================================================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";

        // Auth endpoints should NOT redirect
        const isAuthEndpoint =
            requestUrl.includes('/api/auth/login') ||
            requestUrl.includes('/api/auth/signup') ||
            requestUrl.includes('/api/auth/forgot-password') ||
            requestUrl.includes('/api/auth/verify-otp') ||
            requestUrl.includes('/api/auth/reset-password');

        if ((status === 401 || status === 403) && !isAuthEndpoint) {

            // Clear user session
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            delete api.defaults.headers.common["Authorization"];

            // Redirect
            window.location.assign("/login");
        }

        return Promise.reject(error);
    }
);

// ===========================================================
// 4. AUTH APIs
// ===========================================================
export const apiSignUp = (data) => api.post("/auth/signup", data);
export const apiLogin = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/users/me");
export const apiGetFullProfile = () => api.get("/users/me");
export const apiUpdateProfile = (data) => api.put("/users/me", data);
export const apiChangePassword = (data) => api.post("/users/change-password", data);

export const apiForgotPassword = (data) => api.post("/auth/forgot-password", data);
export const apiVerifyOtp = (data) => api.post("/auth/verify-otp", data);
export const apiResetPassword = (data) => api.post("/auth/reset-password", data);

// ===========================================================
// 5. PREDICTION APIS
// ===========================================================
export const apiUpload = (formData) =>
    api.post("/predictions/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const getAllPredictions = () => api.get("/predictions");
export const apiDeletePrediction = (predictionId) =>
    api.delete(`/predictions/${predictionId}`);

// ===========================================================
// 6. DERMATOLOGISTS
// ===========================================================
export const apiListDermatologists = (q = "", limit = 10) => {
    const params = {};
    if (q) params.q = q;
    if (limit) params.limit = limit;

    return api.get("/users/dermatologists", { params });
};

// ===========================================================
// 7. REVIEW REQUESTS
// ===========================================================
export const apiCreateReviewRequest = ({ predictionId, dermatologistId }) =>
    api.post("/review-requests", { predictionId, dermatologistId });

export const apiGetReviewRequest = (requestId) =>
    api.get(`/review-requests/${requestId}`);

export const apiGetReviewRequests = () =>
    api.get("/review-requests");

export const apiSubmitReview = (requestId, comment) =>
    api.post(`/review-requests/${requestId}/review`, { comment });

export const apiRejectReview = (requestId, comment) =>
    api.post(`/review-requests/${requestId}/reject`, { comment });

export const apiDeleteReviewRequest = (requestId) =>
    api.delete(`/review-requests/${requestId}`);

// ===========================================================
// 8. NOTIFICATIONS
// ===========================================================
export const apiGetNotifications = (unreadOnly = true) => {
    const params = unreadOnly ? { unreadOnly: true } : {};
    return api.get("/notifications", { params });
};

export const apiMarkNotificationRead = (id) =>
    api.patch(`/notifications/${id}/read`);

// ===========================================================
// 9. EXPORT DEFAULT
// ===========================================================
export default api;