import { ServerResponse } from 'http';
import { registerUser, loginUser } from '../services/authService';
import { successResponse, errorResponse } from '../utils/response';

export const register = async (body: any, res: ServerResponse): Promise<void> => {
  try {
    const { username, email, password } = body;

    if (!username || !email || !password) {
      errorResponse(res, 'Username, email, and password are required', 400);
      return;
    }

    const result = await registerUser(username, email, password);
    successResponse(res, result, 201);
  } catch (error: any) {
    errorResponse(res, error.message, 400);
  }
};

export const login = async (body: any, res: ServerResponse): Promise<void> => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      errorResponse(res, 'Email and password are required', 400);
      return;
    }

    const result = await loginUser(email, password);
    successResponse(res, result, 200);
  } catch (error: any) {
    errorResponse(res, error.message, 401);
  }
};
