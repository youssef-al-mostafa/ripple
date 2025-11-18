import { MongoClient, Db, Collection } from 'mongodb';
import { ENV } from './env';
import { User } from '../types/user.types';
import { Message } from '../types/message.types';

let client: MongoClient;
let db: Db;

export const connectDatabase = async (): Promise<void> => {
  try {
    client = new MongoClient(ENV.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDatabase first.');
  }
  return db;
};

export const getUsersCollection = (): Collection<User> => {
  return getDb().collection<User>('users');
};

export const getMessagesCollection = (): Collection<Message> => {
  return getDb().collection<Message>('messages');
};

export const getRoomsCollection = (): Collection => {
  return getDb().collection('rooms');
};
