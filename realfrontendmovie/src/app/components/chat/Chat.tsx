import { createGroup, getAccessToken, getLoggedInUsers } from '@/services/api';
import socket from '@/services/socket';
import React, { useEffect, useState } from 'react';
import ChatButton from './chatbutton';
import ChatList from './chatlist';
import ChatWindow from './chatwindow';

interface User {
  id: string;
  name: string;
}

const Chat: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});
  const [chatGroups, setChatGroups] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
    if (token) {
      async function fetchLoggedInUsers() {
        try {
          const loggedInUsers = await getLoggedInUsers();
          setUsers(loggedInUsers);
        } catch (error) {
          console.error('Error fetching logged-in users:', error);
        }
      }
      fetchLoggedInUsers();
    }
  }, []);

  useEffect(() => {
    const handleNewMessage = (newMessage: { user: string; fromSelf: boolean }) => {
      if (!newMessage.fromSelf) {
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.user]: (prev[newMessage.user] || 0) + 1,
        }));
      }
    };

    const handleMessageDelivered = (data: { toUser: string }) => {
      setUnreadMessages((prev) => ({
        ...prev,
        [data.toUser]: 0,
      }));
    };

    socket.on('message', handleNewMessage);
    socket.on('messageDelivered', handleMessageDelivered);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('messageDelivered', handleMessageDelivered);
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
    if (selectedUser) {
      setSelectedUser(null);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setUnreadMessages((prev) => ({
      ...prev,
      [user.id]: 0,
    }));
  };

  const onCreateGroup = async (groupName: string, memberIds: string[]) => {
    try {
      const groupData = {
        groupName: groupName,  // Match the key "groupName"
        memberIds: memberIds.map(id => parseInt(id)),  // Ensure IDs are integers
      };
      console.log('Payload:', groupData);  // Debugging: Log the payload to verify
      const newGroup = await createGroup(groupData);
      console.log('Group created successfully:', newGroup);
    } catch (error) {
      console.error('Error :', error);
    }
  };




  return (
    <div className="chat-container">
      <ChatButton onClick={toggleChat} unreadMessages={Object.values(unreadMessages).reduce((a, b) => a + b, 0)} />
      {isChatOpen && !selectedUser && (
        <ChatList
          users={users}
          onSelectUser={selectUser}
          unreadMessages={unreadMessages}
          onCreateGroup={onCreateGroup}  // Pass the onCreateGroup function
        />
      )}
      {selectedUser && (
        <ChatWindow user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default Chat;
