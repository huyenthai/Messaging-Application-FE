import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {authApi} from '../utils/axiosInstance';
import '../App.css'; 

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.post('/api/auth/signup', { username, email, password });
      alert('Signup successful! Please login.');
      navigate('/');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Sign Up</button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/" className="text-blue-600">Login</Link>
      </p>
      </div>
  </div>
  );
};

export default SignupPage;
