import { ConnectedClient, WebSocketMessage } from '../types/websocket.types';

export const connectedClients = new Map<string, ConnectedClient>();

export const broadcastToRoom = (roomId: string, message: WebSocketMessage, excludeUserId?: string): void => {
  connectedClients.forEach((client, userId) => {
    if (client.roomId === roomId && userId !== excludeUserId && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
};

export const broadcastToAll = (message: WebSocketMessage): void => {
  connectedClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
};

export const sendToUser = (userId: string, message: WebSocketMessage): void => {
  const client = connectedClients.get(userId);
  if (client && client.readyState === 1) {
    client.send(JSON.stringify(message));
  }
};
