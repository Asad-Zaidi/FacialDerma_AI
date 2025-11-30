import axios from 'axios';

// base API instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
    withCredentials: true, // allow httpOnly cookies for refresh token if used
});

// simple in-memory flag for refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}
function onRefreshed(token) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

// request interceptor: attach access token from local storage (or context getter)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken'); // or get from AuthContext
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

// response interceptor: handle 401 by trying refresh
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        resolve(api(originalRequest));
                    });
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                // Call refresh endpoint (server should set new access token or return it)
                const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
                const newToken = response.data.accessToken;
                localStorage.setItem('accessToken', newToken);
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                onRefreshed(newToken);
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed -> force logout (clear tokens)
                localStorage.removeItem('accessToken');
                // Optionally dispatch a logout event the app listens to:
                window.dispatchEvent(new Event('force-logout'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;