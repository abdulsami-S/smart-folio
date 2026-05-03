import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    // Note: The actual access token is injected from the AuthContext in React components,
    // or we can store it in a module variable here.
    // For React, it's often easier to let the API functions accept the token, 
    // or let AuthContext manage the interceptor.
    // We will set up a dynamic token setter here.
    return config;
  },
  (error) => Promise.reject(error)
);

let currentToken = null;
export const setAccessToken = (token) => {
  currentToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Response interceptor for refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        const response = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        // Will be handled by AuthContext to redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
