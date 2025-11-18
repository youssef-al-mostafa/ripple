import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f5f5f5' }}>
      {messages.map((message, index) => {
        const isOwnMessage = message.userId === currentUserId;
        return (
          <div
            key={message._id || index}
            style={{
              marginBottom: '15px',
              display: 'flex',
              justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '10px 15px',
                borderRadius: '8px',
                backgroundColor: isOwnMessage ? '#007bff' : '#fff',
                color: isOwnMessage ? '#fff' : '#000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {!isOwnMessage && (
                <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9em' }}>
                  {message.username}
                </div>
              )}
              <div>{message.text}</div>
              <div style={{ fontSize: '0.75em', marginTop: '5px', opacity: 0.8 }}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
