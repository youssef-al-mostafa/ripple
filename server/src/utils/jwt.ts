import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
