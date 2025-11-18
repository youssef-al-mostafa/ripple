import { LoginCredentials, RegisterCredentials, AuthResponse, Message } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Registration failed');
  }

  return data.data;
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Login failed');
  }

  return data.data;
};

export const getMessages = async (roomId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages?roomId=${roomId}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch messages');
  }

  return data.data;
};

export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'GET',
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch profile');
  }

  return data.data;
};
