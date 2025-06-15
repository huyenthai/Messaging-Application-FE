import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userApi } from '../utils/axiosInstance';

import '../App.css';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

const handleDeleteAccount = async () => {
  const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (!confirmed) return;

  try {
    const response = await userApi.delete('/api/user/delete-account');

    if (response.status === 204) {
      alert("Your account has been deleted.");
      logout();
      navigate('/');
    } else {
      alert("Failed to delete account.");
    }
  } catch (err) {
    console.error(err);
    alert("An unexpected error occurred.");
  }
};


  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="profile-box">
        <h2>Your Profile</h2>
        <div className="profile-info">
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="delete-btn" onClick={handleDeleteAccount}>
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
