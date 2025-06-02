import React, { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi, userApi } from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, token } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Contacts</h2>
      <ul className="mb-6">
        {contacts.map((user, i) => (
          <li key={i}>
            <button
              onClick={() => navigate(`/chat/${user.id}`)}
              className="text-blue-600 underline"
            >
              Chat with {user.username || user.id}
            </button>
          </li>
        ))}

      </ul>

      <h3 className="text-xl font-semibold mb-2">Search Users</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter username"
          className="border p-2 flex-1"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">Search</button>
      </div>
      <ul>
        {searchResults.map((user, i) => (
          <li key={i}>
            <button
              onClick={() => navigate(`/chat/${user.id}`)}
              className="text-green-600 underline"
            >
              Chat with {user.username || user.id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;