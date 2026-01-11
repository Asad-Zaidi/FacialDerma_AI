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
// 3.5. REQUEST INTERCEPTOR — DEBUG LOGGING
// ===========================================================
let userMeCallCount = 0;
api.interceptors.request.use((config) => {
    if (config.url.includes('/users/me')) {
        userMeCallCount++;
        const timestamp = new Date().toLocaleTimeString();
        const stackTrace = new Error().stack
            .split('\n')
            .slice(2, 6)  // Get relevant stack frames
            .join('\n');
        console.log(
            `%c[${timestamp}] GET /users/me - Call #${userMeCallCount}`,
            'color: red; font-weight: bold; font-size: 12px;'
        );
        console.log('%cStack Trace:', 'color: orange; font-weight: bold;');
        console.log(stackTrace);
    }
    return config;
});

// ===========================================================
// 3.6. INTERCEPTOR — HANDLE 401/403
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
            requestUrl.includes('/api/auth/verify-email') ||
            requestUrl.includes('/api/auth/forgot-password') ||
            requestUrl.includes('/api/auth/verify-otp') ||
            requestUrl.includes('/api/auth/reset-password');

        // Only logout on 401 (unauthorized/invalid token)
        // Don't logout on 403 - it could be suspension or other access denial
        // The SuspensionCheck component will handle displaying suspension status
        // Avoid hard reload if already on auth pages to prevent modal flashing
        const currentPath = (window.location.pathname || '').toLowerCase();
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup');

        if (status === 401 && !isAuthEndpoint && !isAuthPage) {

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
export const apiCreateReviewRequest = ({ predictionId, dermatologistId, message }) =>
    api.post("/review-requests", { predictionId, dermatologistId, message });

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
// 9. USERNAME AVAILABILITY
// ===========================================================
export const apiCheckUsername = (username) =>
    api.get("/users/check-username", { params: { username } });

// ===========================================================
// 10. MAP APIs
// ===========================================================
export const apiGetNearbyDermatology = (lat, lng, radius = 10000) =>
    api.get("/map/nearest-dermatology", { params: { lat, lng, radius } });

export const apiVerifyEmail = (token) =>
    api.get("/auth/verify-email", { params: { token } });

export const apiVerifyEmailOTP = (data) =>
    api.post("/auth/verify-email-otp", data);

export const apiResendVerificationEmail = (data) =>
    api.post("/auth/verification/resend", data);

// ===========================================================
// 11. ADMIN APIs
// ===========================================================
export const apiGetDashboardStats = () => api.get("/admin/dashboard/stats");
export const apiGetPendingVerifications = () => api.get("/admin/dermatologists/pending");
export const apiGetRejectedVerifications = () => api.get("/admin/dermatologists/rejected");
export const apiVerifyDermatologist = (dermatologistId, data) => 
    api.post(`/admin/dermatologists/${dermatologistId}/verify`, data);
export const apiGetAllUsers = (params = {}) => api.get("/admin/users", { params });
export const apiSuspendUser = (userId) => api.post(`/admin/users/${userId}/suspend`);
export const apiUnsuspendUser = (userId) => api.post(`/admin/users/${userId}/unsuspend`);
export const apiDeleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const apiUpdateAdminProfile = (data) => api.put("/admin/profile", data);
export const apiChangeAdminPassword = (data) => api.post("/admin/change-password", data);
export const apiGetActivityLogs = (params = {}) => api.get("/admin/activity-logs", { params });

// ===========================================================
// 13. TREATMENT SUGGESTIONS APIs
// ===========================================================
export const apiGetTreatmentSuggestions = () => api.get("/treatment/suggestions");
export const apiGetTreatmentSuggestion = (name) => api.get(`/treatment/suggestions/${name}`);
export const apiCreateTreatmentSuggestion = (data) => api.post("/treatment/suggestions", data);
export const apiUpdateTreatmentSuggestion = (name, data) => api.put(`/treatment/suggestions/${name}`, data);
export const apiDeleteTreatmentSuggestion = (name) => api.delete(`/treatment/suggestions/${name}`);

// ===========================================================
// 14. SUPPORT TICKETS APIs
// ===========================================================
export const apiSubmitSupportTicket = (data) => api.post("/support/tickets", data);
export const apiGetSupportTickets = (status = '') => api.get(`/support/tickets${status ? `?status=${status}` : ''}`);
export const apiUpdateSupportTicket = (ticketId, data) => api.put(`/support/tickets/${ticketId}`, data);
export const apiDeleteSupportTicket = (ticketId) => api.delete(`/support/tickets/${ticketId}`);

// ===========================================================
// 15. EXPORT DEFAULT
// ===========================================================
export default api;