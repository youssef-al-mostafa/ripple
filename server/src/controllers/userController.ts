import { ServerResponse } from 'http';
import { getUserById } from '../services/userService';
import { successResponse, errorResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: ServerResponse): Promise<void> => {
  try {
    if (!req.user?.userId) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }

    const user = await getUserById(req.user.userId);
    successResponse(res, user, 200);
  } catch (error: any) {
    errorResponse(res, error.message, 400);
  }
};
