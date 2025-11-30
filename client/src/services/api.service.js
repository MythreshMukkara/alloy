// client/src/services/api.service.js
import axios from 'axios';

// Create a pre-configured instance of axios
const api = axios.create({
    baseURL: 'http://localhost:3232/api', // Your backend's base URL
});

// === Add a request interceptor ===
// This function will be called before every request is sent
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');

        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default api;