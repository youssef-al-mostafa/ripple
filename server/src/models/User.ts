import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '../config/database';
import { User, UserResponse } from '../types/user.types';

export const createUser = async (username: string, email: string, password: string): Promise<UserResponse> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = {
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const result = await getUsersCollection().insertOne(user);

  return {
    _id: result.insertedId,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await getUsersCollection().findOne({ email });
};

export const findUserById = async (userId: string): Promise<UserResponse | null> => {
  const user = await getUsersCollection().findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
