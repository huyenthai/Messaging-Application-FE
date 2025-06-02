import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { chatApi, mediaApi, userApi } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [chatUserName, setChatUserName] = useState(null);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const fileRef = useRef();
  const [allowed, setAllowed] = useState(null); 
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();

// Validate access FIRST
useEffect(() => {
  const validateAccess = async () => {
    try {
      const res = await chatApi.get('/api/chat/contacts');
      const allowedUserIds = res.data.map(String);
      setAllowed(allowedUserIds.includes(userId));
    } catch (err) {
      console.error("Access validation failed:", err);
      setAllowed(false);
    } finally {
      setIsValidating(false);
    }
  };

  validateAccess();
}, [userId]);



 // Only load messages AFTER access is granted
useEffect(() => {
  const loadMessages = async () => {
    try {
      const historyRes = await chatApi.get(`/api/chat/history?receiverId=${userId}`);
      const msgs = historyRes.data;

      const senderIds = msgs.map(m => parseInt(m.senderId)).filter(id => !isNaN(id));
      const uniqueIds = [...new Set([...senderIds, parseInt(userId)])];

      const userRes = await userApi.post('/api/user/bulk', uniqueIds);
      const map = {};
      userRes.data.forEach(u => {
        map[u.id] = u.username;
      });

      const updatedMessages = await Promise.all(msgs.map(async (msg) => {
        if (msg.messageType === 'image' && msg.blobName) {
          const res = await mediaApi.get(`/api/media/url/${msg.blobName}`);
          return { ...msg, imageUrl: res.data.sasUrl };
        }
        return msg;
      }));

      setMessages(updatedMessages);
      setUserMap(map);
      setChatUserName(map[userId]);
    } catch (err) {
      console.error(err);
    }
  };

  if (allowed) {
    loadMessages();
  }
}, [userId, allowed]);

useEffect(() => {
  if (isValidating) return;
  if (allowed === false) {
    navigate('/dashboard');
  }
}, [allowed, isValidating, navigate]);


const handleSend = async () => {
  if (!message && !image) return;

  let payload = {
    receiverId: userId,
    message: message || null,
    blobName: null,
    messageType: image ? 'image' : 'text'
  };

  if (image) {
    const formData = new FormData();
    formData.append('file', image);
    const uploadRes = await mediaApi.post('/api/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    payload.blobName = uploadRes.data.blobName;
    // still keep message if one was typed
  }

  await chatApi.post('/api/chat/send', payload);
  setMessage('');
  setImage(null);
  fileRef.current.value = null;

  // Re-fetch with SAS URLs
  const updatedRes = await chatApi.get(`/api/chat/history?receiverId=${userId}`);
  const msgs = updatedRes.data;

  const messagesWithUrls = await Promise.all(msgs.map(async (msg) => {
    if (msg.messageType === 'image' && msg.blobName) {
      try {
        const res = await mediaApi.get(`/api/media/url/${msg.blobName}`);
        return { ...msg, imageUrl: res.data.sasUrl };
      } catch {
        return { ...msg, imageUrl: null };
      }
    }
    return msg;
  }));

  setMessages(messagesWithUrls);
};


  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat with {chatUserName || userId}</h2>
      <div className="space-y-2 border p-4 h-96 overflow-y-scroll mb-4">
       {messages.map((msg, i) => (
      <div key={i} className="border-b pb-2">
        <p><strong>{userMap[msg.senderId] || msg.senderId}</strong>:</p>

        {msg.message && <p>{msg.message}</p>}

        {msg.blobName && msg.imageUrl && (
          <img src={msg.imageUrl} alt="sent" className="w-48" />
        )}

        <p className="text-xs text-gray-500">{new Date(msg.timeSent).toLocaleString()}</p>
      </div>
    ))}

      </div>
      <div className="flex flex-col gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2"
          rows="2"
          placeholder="Type your message..."
        />
        <input type="file" ref={fileRef} onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
