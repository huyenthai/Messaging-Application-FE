import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return null; // Or a loading spinner
  if (!user || !token) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
