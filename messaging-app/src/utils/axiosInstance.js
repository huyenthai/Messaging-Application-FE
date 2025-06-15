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

// Use .env variables (set in frontend Docker context or dev env)
export const authApi = createSecuredClient(process.env.REACT_APP_AUTH_URL);
export const userApi = createSecuredClient(process.env.REACT_APP_USER_URL);
export const chatApi = createSecuredClient(process.env.REACT_APP_CHAT_URL);
export const mediaApi = createSecuredClient(process.env.REACT_APP_MEDIA_URL);
