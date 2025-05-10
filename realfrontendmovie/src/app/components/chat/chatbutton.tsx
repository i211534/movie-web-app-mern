import { faComments } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ChatButtonProps {
  onClick: () => void;
  unreadMessages: number;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, unreadMessages }) => {
  return (
    <div className="chat-button" onClick={onClick}>
      <FontAwesomeIcon icon={faComments} className="chat-icon" />
      {unreadMessages > 0 && <span className="notification-badge">{unreadMessages}</span>}
      <style jsx>{`
        .chat-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, #007bff, #0056b3);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease-in-out;
          font-size: 24px; /* Icon size */
        }
        .chat-button:hover {
          background: linear-gradient(145deg, #0056b3, #003f8a);
          transform: scale(1.1);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        .chat-icon {
          font-size: 28px;
        }
        .notification-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          background: red;
          color: white;
          border-radius: 50%;
          padding: 5px 7px;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ChatButton;
