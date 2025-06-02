import axios from 'axios';

// Helper to create client with token interceptor
const createSecuredClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
  });

  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const authApi = createSecuredClient('http://localhost:5000');
export const userApi = createSecuredClient('http://localhost:5001');
export const chatApi = createSecuredClient('http://localhost:5002');
export const mediaApi = createSecuredClient('http://localhost:5003');
