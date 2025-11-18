import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp',
  JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
};
