import React, { createContext, useState, useEffect } from 'react';
import { chatApi, userApi, mediaApi } from '../utils/axiosInstance';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedToken = sessionStorage.getItem('token');

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        chatApi.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        userApi.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        mediaApi.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', jwt);
    chatApi.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    userApi.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    mediaApi.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear();
    delete chatApi.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
