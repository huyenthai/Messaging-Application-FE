import React, { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi, userApi } from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import '../App.css'; 
import * as signalR from "@microsoft/signalr";


const DashboardPage = () => {
  const { user, token } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userMap, setUserMap] = useState({});

  const navigate = useNavigate();
    useEffect(() => {
    if (!user || !token) {
      navigate('/');
    }
  }, [user, token, navigate]);


useEffect(() => {
  const fetchContacts = async () => {
    try {
      const contactIdRes = await chatApi.get('/api/chat/contacts');
      const contactIds = contactIdRes.data;

      // Convert string IDs to integers
      const intIds = contactIds
        .map(id => parseInt(id))
        .filter(id => !isNaN(id)); 

      if (intIds.length > 0) {
        const userRes = await userApi.post('/api/user/bulk', intIds);
        setContacts(userRes.data);
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  fetchContacts();
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5002/chatHub", {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();

  connection.start().then(() => {
    connection.on("ReceiveMessage", async (msg) => {
      if (msg.receiverId === user.id) {
        const senderId = parseInt(msg.senderId);
        const alreadyInContacts = contacts.some(u => u.id === senderId);

        if (!alreadyInContacts) {
          try {
            const userRes = await userApi.post('/api/user/bulk', [senderId]);
            const newUser = userRes.data[0];

            setContacts(prev => [...prev, newUser]);
          } catch (err) {
            console.error('Failed to load new sender info:', err);
          }
        }
      }
    });
  }).catch(err => console.error("SignalR connection failed:", err));

  // Cleanup
  return () => {
    connection.stop();
  };

}, []);


  const handleSearch = async () => {
    try {
      const res = await userApi.get(`/api/user/search?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed');
    }
  };

  return (
    <div className="dashboard-wrapper">
     <div className="dashboard-header">
    <button className="profile-btn" onClick={() => navigate('/profile')}>
      Profile
    </button>
  </div>

  <div className="dashboard">
    <div className="left-pane">
      <h2>Your Contacts</h2>
      <ul>
        {contacts.map((user, i) => (
          <li key={i}>
            <button
             onClick={() => navigate(`/chat/${user.id}`, { state: { fromSearch: true } })}
              className="contact-btn"
            >
              Chat with {user.username || user.id}
            </button>
          </li>
        ))}
      </ul>
    </div>

    <div className="right-pane">
      <h2>Search Users</h2>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter username"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <ul>
        {searchResults.map((user, i) => (
          <li key={i}>
            <button
              onClick={() => navigate(`/chat/${user.id}`, { state: { fromSearch: true } })}
              className="search-btn"
            >
              Chat with {user.username || user.id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
  </div>
);

};
export default DashboardPage; 