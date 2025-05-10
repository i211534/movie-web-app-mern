import { User } from '@/app/types';
import { getAccessToken, getMessages, getProfile, getProfilelow, postMessage } from '@/services/api';
import socket from '@/services/socket';
import React, { useEffect, useState } from 'react';

interface ChatWindowProps {
  user: User;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState<{ user: string; message: string; fromSelf: boolean }[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);

    if (token) {
      async function fetchProfile() {
        try {
          const datalow = await getProfilelow();
          setProfile(datalow);
          const data = await getProfile(datalow.userId);
          setProfile(data);
          socket.emit('register', { userId: data.id, name: data.name }); // Register the user with their profile ID and name

          // Fetch chat history
          const chatHistory = await getMessages(data.id, user.id);
          setMessages(chatHistory.map((msg: any) => ({
            user: msg.senderId === data.id ? data.name : user.name,
            message: msg.content,
            fromSelf: msg.senderId === data.id
          })));
        } catch (error) {
          console.error('Error fetching profile or chat history:', error);
        }
      }
      fetchProfile();
    }

    socket.on('message', (newMessage: { user: string; message: string; fromSelf: boolean }) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [user.id]);

  const sendMessage = async () => {
    if (message.trim() && profile) {
      socket.emit('message', { toUser: user.id, fromUser: profile.id, message: message });

      // Save message to the backend
      await postMessage({ senderId: profile.id, receiverId: user.id, content: message });

      setMessages((prevMessages) => [...prevMessages, { user: profile.name, message: message, fromSelf: true }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>{user.name}</span>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.fromSelf ? 'sent' : 'received'}`}>
            <div className="message-content">
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          </div>

        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <style jsx>{`
  .chat-window {
    width: 300px;
    height: 400px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
    position: fixed;
    bottom: 20px;
    right: 80px;
    z-index: 1000;
  }
  .chat-header {
    background-color: #4caf50;
    padding: 10px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .chat-header span {
    font-size: 16px;
    font-weight: bold;
  }
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  .chat-messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #fff;
  }
  .chat-messages::-webkit-scrollbar {
    width: 8px;
  }
  .chat-messages::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
  }
  .chat-messages::-webkit-scrollbar-thumb {
    background-color: #4caf50;
    border-radius: 10px;
    border: 2px solid #f0f0f0;
  }
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background-color: #45a049;
  }
  .message {
    margin-bottom: 10px;
    max-width: 80%;
    display: flex;
    align-items: flex-start;
  }
  .message.sent {
    align-self: flex-end;
    text-align: right;
    
    justify-content: flex-end;
  }
  .message.received {
    align-self: flex-start;
    text-align: left;
    justify-content: flex-start;
  }
  .message-content {
    background-color: #4caf50;
    color: white;
    padding: 8px;
    border-radius: 5px;
    display: inline-block;
    word-break: break-word;
  }
  .message.received .message-content {
    background-color: #e0e0e0;
    color: black;
  }
  .chat-input {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  .chat-input input {
    flex: 1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 10px;
    font-size: 14px;
  }
  .chat-input button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
  }
  .chat-input button:hover {
    background-color: #45a049;
  }
`}</style>

    </div>
  );
};

export default ChatWindow;
