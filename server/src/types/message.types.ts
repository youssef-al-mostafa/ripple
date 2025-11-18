import { ObjectId } from 'mongodb';

export interface Message {
  _id?: ObjectId;
  userId: string;
  username: string;
  text: string;
  roomId: string;
  timestamp: Date;
  fileUrl?: string;
}

export type MessagePayload = Omit<Message, '_id' | 'timestamp'>;
