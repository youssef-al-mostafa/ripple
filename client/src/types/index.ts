export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface Message {
  _id?: string;
  userId: string;
  username: string;
  text: string;
  roomId: string;
  timestamp: Date;
  fileUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export enum MessageType {
  MESSAGE = 'MESSAGE',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  TYPING = 'TYPING',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  ERROR = 'ERROR',
}

export interface WebSocketMessage {
  type: MessageType;
  payload: any;
}
