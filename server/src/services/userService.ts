import { findUserById } from '../models/User';
import { UserResponse } from '../types/user.types';

export const getUserById = async (userId: string): Promise<UserResponse> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUser = async (userId: string, updates: Partial<UserResponse>): Promise<UserResponse> => {
  throw new Error('Not implemented');
};
