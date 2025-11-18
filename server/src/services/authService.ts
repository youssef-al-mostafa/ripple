import { createUser, findUserByEmail, comparePassword } from '../models/User';
import { generateToken } from '../utils/jwt';
import { validateEmail, validatePassword, validateUsername } from '../utils/validation';
import { UserResponse } from '../types/user.types';

export const registerUser = async (username: string, email: string, password: string): Promise<{ user: UserResponse; token: string }> => {
  if (!validateUsername(username)) {
    throw new Error('Username must be between 3 and 30 characters');
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const user = await createUser(username, email, password);
  const token = generateToken(user._id!.toString());

  return { user, token };
};

export const loginUser = async (email: string, password: string): Promise<{ user: UserResponse; token: string }> => {
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id!.toString());

  const userResponse: UserResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };

  return { user: userResponse, token };
};
