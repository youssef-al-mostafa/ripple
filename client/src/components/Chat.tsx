import React, { useState, useEffect } from 'react';
import { Message, MessageType } from '../types';
import { wsService } from '../services/websocket';
import { getMessages } from '../services/api';
import { MessageList } from './MessageList';

interface ChatProps {
  token: string;
  username: string;
  onLogout: () => void;
}

export const Chat: React.FC<ChatProps> = ({ token, username, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomId] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await getMessages(roomId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();

    wsService.connect(token);
    wsService.joinRoom(roomId);

    wsService.on(MessageType.MESSAGE, (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    wsService.on(MessageType.USER_JOINED, (data) => {
      console.log(`${data.username} joined the room`);
    });

    wsService.on(MessageType.USER_LEFT, (data) => {
      console.log(`${data.username} left the room`);
    });

    wsService.on(MessageType.TYPING, (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => [...prev, data.username]);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== data.username));
      }
    });

    wsService.on(MessageType.ERROR, (error) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      wsService.disconnect();
    };
  }, [token, roomId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() && wsService.isConnected()) {
      wsService.sendMessage(newMessage, roomId);
      setNewMessage('');
      setIsTyping(false);
      wsService.sendTyping(roomId, false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      wsService.sendTyping(roomId, true);
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      wsService.sendTyping(roomId, false);
    }
  };

  const handleLogout = () => {
    wsService.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    onLogout();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Chat Room - {roomId}</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {username}</span>
          <button onClick={handleLogout} style={{ padding: '5px 15px', backgroundColor: 'white', color: '#007bff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <MessageList messages={messages} currentUserId={userId} />

      {typingUsers.length > 0 && (
        <div style={{ padding: '5px 20px', fontSize: '0.9em', color: '#666' }}>
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button type="submit" disabled={!newMessage.trim()} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
};
