import { ConnectedClient, WebSocketMessage, MessageTypes } from '../types/websocket.types';
import { createMessage } from '../services/messageService';
import { broadcastToRoom } from './broadcast';

export const handleMessage = async (client: ConnectedClient, data: WebSocketMessage): Promise<void> => {
  try {
    const { text, roomId } = data.payload;

    if (!client.userId || !client.username) {
      client.send(JSON.stringify({
        type: MessageTypes.ERROR,
        payload: { message: 'User not authenticated' }
      }));
      return;
    }

    const message = await createMessage({
      userId: client.userId,
      username: client.username,
      text,
      roomId: roomId || 'general',
    });

    const broadcastData: WebSocketMessage = {
      type: MessageTypes.MESSAGE,
      payload: message,
    };

    broadcastToRoom(roomId || 'general', broadcastData);
  } catch (error: any) {
    client.send(JSON.stringify({
      type: MessageTypes.ERROR,
      payload: { message: error.message }
    }));
  }
};

export const handleJoin = (client: ConnectedClient, data: WebSocketMessage): void => {
  const { roomId } = data.payload;
  client.roomId = roomId || 'general';

  const joinMessage: WebSocketMessage = {
    type: MessageTypes.USER_JOINED,
    payload: {
      username: client.username,
      userId: client.userId,
      roomId: client.roomId,
    },
  };

  broadcastToRoom(client.roomId, joinMessage);
};

export const handleLeave = (client: ConnectedClient): void => {
  if (!client.roomId) return;

  const leaveMessage: WebSocketMessage = {
    type: MessageTypes.USER_LEFT,
    payload: {
      username: client.username,
      userId: client.userId,
      roomId: client.roomId,
    },
  };

  broadcastToRoom(client.roomId, leaveMessage, client.userId);
};

export const handleTyping = (client: ConnectedClient, data: WebSocketMessage): void => {
  const { roomId, isTyping } = data.payload;

  const typingMessage: WebSocketMessage = {
    type: MessageTypes.TYPING,
    payload: {
      username: client.username,
      userId: client.userId,
      isTyping,
    },
  };

  broadcastToRoom(roomId || 'general', typingMessage, client.userId);
};
