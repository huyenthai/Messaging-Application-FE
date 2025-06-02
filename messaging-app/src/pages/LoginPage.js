import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {authApi} from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import '../App.css'; 


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await authApi.post('api/Auth/login', { email, password });
    const token = response.data.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user = {
      id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      username: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
    };
    login(user, token);
    console.log('Login success:', user);
    navigate('/dashboard');
  } catch (err) {
    alert('Login failed');
  }
};


  return (
   <div className="auth-container">
      <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;