import WebSocket from 'ws';

export enum MessageTypes {
  MESSAGE = 'MESSAGE',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  TYPING = 'TYPING',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  ERROR = 'ERROR',
}

export interface WebSocketMessage {
  type: MessageTypes;
  payload: any;
  roomId?: string;
  userId?: string;
  username?: string;
}

export interface ConnectedClient extends WebSocket {
  userId?: string;
  username?: string;
  roomId?: string;
  isAlive?: boolean;
}
