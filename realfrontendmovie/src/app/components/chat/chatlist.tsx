import { getAccessToken, getChatGroups, getProfile, getProfilelow } from '@/services/api';
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
}

interface groupInterface {
  id: number;
  name: string;  // Added this line
  description?: string;
  members: User[];
}

interface ChatListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  unreadMessages: { [key: string]: number };
  onCreateGroup: (groupName: string, memberIds: string[]) => void;
}

const ChatList: React.FC<ChatListProps> = ({ users, onSelectUser, unreadMessages, onCreateGroup }) => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [group, setGroup] = useState<groupInterface[]>([]);

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

          const groupnamereal = await getChatGroups();
          groupnamereal.forEach((group: { name: any; }) => {
            console.log("Getting Group Name: ", group.name);
          });
          setGroup(groupnamereal);


        } catch (error) {
          console.error('Error fetching profile or chat history:', error);
        }
      }
      fetchProfile();
    }
  }, []);

  const handleGroupCreation = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName, selectedMembers);
      setShowGroupModal(false);
      setGroupName('');
      setSelectedMembers([]);
    } else {
      alert('Please enter a group name and select at least one member.');
    }
  };

  const toggleMemberSelection = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const seenNames = new Set<string>();
  const uniqueUsers = users.filter(user => {
    if (seenNames.has(user.name)) {
      return false;
    } else {
      seenNames.add(user.name);
      return true;
    }
  });

  return (
    <div className="chat-list">
      <div className="group-chat-button" onClick={() => setShowGroupModal(true)}>
        Create Group Chat
      </div>

      {uniqueUsers.map((user) => (
        <div key={user.id} className="user-item" onClick={() => onSelectUser(user)}>
          {user.name}
          {unreadMessages[user.id] > 0 && <span className="notification-badge">{unreadMessages[user.id]}</span>}
        </div>
      ))}

      {showGroupModal && (
        <div className="group-modal">
          <div className="modal-content">
            <h3>Create Group Chat</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <div className="user-selection">
              {uniqueUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${selectedMembers.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => toggleMemberSelection(user.id)}
                >
                  {user.name}
                </div>
              ))}
            </div>
            <div className="group-selection">
              {group.map(groupreal => (
                <li key={groupreal.id}>`${groupreal.forEach((group: { name: any; }) => {
                  console.log("Getting Group Name: ", group.name);
                })}`</li>
              ))}
            </div>
            <button onClick={handleGroupCreation}>Done</button>
            <button onClick={() => setShowGroupModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-list {
          position: fixed;
          bottom: 80px;
          right: 20px;
          color: black;
          width: 250px;
          max-height: 300px;
          overflow-y: auto;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .group-chat-button {
          padding: 10px;
          background-color: #4caf50;
          color: white;
          text-align: center;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          border-radius: 10px 10px 0 0;
        }
        .group-chat-button:hover {
          background-color: #45a049;
        }
        .user-item {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .user-item.selected {
          background-color: #e0e0e0;
        }
        .user-item:hover {
          background-color: #f0f0f0;
        }
        .notification-badge {
          background: red;
          color: white;
          border-radius: 50%;
          padding: 5px;
          font-size: 12px;
        }
        .group-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          width: 300px;
          padding: 20px;
        }
        .modal-content {
          display: flex;
          flex-direction: column;
        }
        .user-selection {
          max-height: 150px;
          overflow-y: auto;
          margin-bottom: 10px;
        }
        .group-selection {
          max-height: 150px;
          overflow-y: auto;
          margin-bottom: 10px;
        }
        button {
          padding: 10px;
          margin-top: 10px;
          background-color: #4caf50;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        input[type="text"] {
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default ChatList;
