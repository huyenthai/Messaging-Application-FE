import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatApi, mediaApi, userApi } from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import '../App.css'; 
import * as signalR from "@microsoft/signalr";



const ChatPage = () => {
  const { userId } = useParams();
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [chatUserName, setChatUserName] = useState(null);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const fileRef = useRef();
  const [allowed, setAllowed] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSearch = location.state?.fromSearch || false;
  const [popupImageUrl, setPopupImageUrl] = useState(null);
  const [isDeletedUser, setIsDeletedUser] = useState(false);


  useEffect(() => {
    if (user?.id && user?.username) {
      setUserMap(prev => ({
        ...prev,
        [user.id]: user.username
      }));
    }
  }, [user]);

  useEffect(() => {
    const validateAccess = async () => {
    try {
      const res = await chatApi.get('api/chat/contacts');
      const allowedUserIds = res.data.map(id => String(id));
      if (allowedUserIds.includes(userId) || fromSearch) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    } catch (err) {
      console.error('Access validation failed:', err);
      setAllowed(false);
    } finally {
      setIsValidating(false);
    }
  };

    validateAccess();
  }, [userId]);

  useEffect(() => {
 const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub", {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();


  connection.start()
    .then(() => {
    connection.on("ReceiveMessage", async (msg) => {
      if (msg.senderId === userId || msg.receiverId === userId) {
        let updatedMsg = msg;
        if (msg.messageType === 'image' && msg.blobName) {
          try {
            const res = await mediaApi.get(`/api/media/url/${msg.blobName}`);
            updatedMsg = { ...msg, imageUrl: res.data.sasUrl };
          } catch {
            updatedMsg = { ...msg, imageUrl: null };
          }
        }
       
    try {
      const userRes = await userApi.post('/api/user/bulk', [msg.senderId]);
      const fetchedUser = userRes.data[0];
        setUserMap(prev => ({
        ...prev,
        [fetchedUser.id]: fetchedUser.username
      }));
      updatedMsg.senderName = fetchedUser.username;

          setUserMap(prev => ({
            ...prev,
            [fetchedUser.id]: fetchedUser.username
          }));
        } catch (err) {
          console.error("Failed to fetch username for new sender:", err);
          updatedMsg.senderName = msg.senderId; // fallback
        }

        setMessages(prev => [...prev, updatedMsg]);
          }
        });

        })
        .catch(err => console.error("SignalR connection error:", err));

  return () => {
    connection.stop();
  };
}, [userId]);
  useEffect(() => {
    const chatBox = document.getElementById('chat-messages');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    const loadMessages = async () => {
      try {
        const historyRes = await chatApi.get(`/chat/api/chat/history?receiverId=${userId}`);
        const msgs = historyRes.data;

        const senderIds = msgs.map(m => parseInt(m.senderId)).filter(id => !isNaN(id));
        const uniqueIds = [...new Set([...senderIds, parseInt(userId)])];

        const userRes = await userApi.post('/user/api/user/bulk', uniqueIds);
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
     
        const chatUser = userRes.data.find(u => u.id == userId);
        setIsDeletedUser(chatUser?.isDeleted === true);
      } catch (err) {
        console.error(err);
      }
    };

    if (allowed) {
      loadMessages();
    }
  }, [userId, allowed]);

  useEffect(() => {
    if (!isValidating && allowed === false) {
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

  try {
    let imageUrl = null;

    // Upload image if present
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const uploadRes = await mediaApi.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      payload.blobName = uploadRes.data.blobName;

      // Generate image URL (SAS)
      const urlRes = await mediaApi.get(`/api/media/url/${payload.blobName}`);
      imageUrl = urlRes.data.sasUrl;
    }

    // Send message to backend
    await chatApi.post('/chat/api/chat/send', payload);

    // Immediately show the message locally
    const newMessage = {
      ...payload,
      senderId: user.id,
      senderName: user.username,
      imageUrl: imageUrl,
      timeSent: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Reset form
    setMessage('');
    setImage(null);
    fileRef.current.value = null;
    
  } catch (err) {
    console.error("Failed to send message:", err);
  }
};


return (
  <div className="chat-page-layout">
    {/* Sidebar on the left */}
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li><button onClick={() => navigate('/dashboard')}>Dashboard</button></li>
        <li><button onClick={() => navigate('/profile')}>Profile</button></li>
      </ul>
    </div>

    {/* Chat section on the right */}
    <div className="chat-section">
      <div className="chat-wrapper">
        <div className="chat-header">
          <h2>Chat with {chatUserName || userId}</h2>
        </div>

        <div className="chat-body" id="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.senderId === user.id ? 'sent' : 'received'}`}>
              <div className="chat-meta-row">
                <span className="chat-user"> {msg.senderName || userMap[msg.senderId] || msg.senderId}</span>
                <span className="chat-time">{new Date(msg.timeSent).toLocaleString()}</span>
              </div>
              <div className="chat-content">
                {msg.message && <p className="chat-text">{msg.message}</p>}
                {msg.blobName && msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="sent"
                    className="chat-img"
                    onClick={() => setPopupImageUrl(msg.imageUrl)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          {isDeletedUser && (
            <p className="chat-disabled-note">
              This user has deleted their account. You can no longer send messages.
            </p>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="2"
            placeholder="Type a message"
            disabled={isDeletedUser}
          />
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => setImage(e.target.files[0])}
            disabled={isDeletedUser}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() && !image || isDeletedUser}
            className={`send-btn ${(message.trim() || image) && !isDeletedUser ? 'active' : 'disabled'}`}
          >
            Send
          </button>
        </div>


        {popupImageUrl && (
          <div className="image-popup-overlay" onClick={() => setPopupImageUrl(null)}>
            <div className="image-popup" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setPopupImageUrl(null)}>×</button>
              <img src={popupImageUrl} alt="full-size" />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default ChatPage;
