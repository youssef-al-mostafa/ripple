import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { ConnectedClient, WebSocketMessage, MessageTypes } from '../types/websocket.types';
import { verifyToken } from '../utils/jwt';
import { findUserById } from '../models/User';
import { connectedClients } from './broadcast';
import { handleMessage, handleJoin, handleLeave, handleTyping } from './events';

export const handleWebSocketConnection = async (ws: WebSocket, req: IncomingMessage): Promise<void> => {
  const client = ws as ConnectedClient;
  client.isAlive = true;

  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      client.send(JSON.stringify({
        type: MessageTypes.ERROR,
        payload: { message: 'Authentication required' }
      }));
      client.close();
      return;
    }

    const decoded = verifyToken(token);
    const user = await findUserById(decoded.userId);

    if (!user) {
      client.send(JSON.stringify({
        type: MessageTypes.ERROR,
        payload: { message: 'User not found' }
      }));
      client.close();
      return;
    }

    client.userId = decoded.userId;
    client.username = user.username;
    client.roomId = 'general';

    connectedClients.set(decoded.userId, client);

    console.log(`User ${user.username} connected`);

    client.on('message', async (message: WebSocket.Data) => {
      try {
        const data: WebSocketMessage = JSON.parse(message.toString());

        switch (data.type) {
          case MessageTypes.MESSAGE:
            await handleMessage(client, data);
            break;
          case MessageTypes.JOIN:
            handleJoin(client, data);
            break;
          case MessageTypes.LEAVE:
            handleLeave(client);
            break;
          case MessageTypes.TYPING:
            handleTyping(client, data);
            break;
          default:
            client.send(JSON.stringify({
              type: MessageTypes.ERROR,
              payload: { message: 'Unknown message type' }
            }));
        }
      } catch (error: any) {
        client.send(JSON.stringify({
          type: MessageTypes.ERROR,
          payload: { message: error.message }
        }));
      }
    });

    client.on('pong', () => {
      client.isAlive = true;
    });

    client.on('close', () => {
      if (client.userId) {
        handleLeave(client);
        connectedClients.delete(client.userId);
        console.log(`User ${client.username} disconnected`);
      }
    });

  } catch (error: any) {
    client.send(JSON.stringify({
      type: MessageTypes.ERROR,
      payload: { message: error.message }
    }));
    client.close();
  }
};

export const startHeartbeat = (wss: WebSocket.Server): void => {
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as ConnectedClient;

      if (client.isAlive === false) {
        return client.terminate();
      }

      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
};
