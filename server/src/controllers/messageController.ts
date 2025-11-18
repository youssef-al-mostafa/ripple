import { ServerResponse } from 'http';
import { fetchMessages } from '../services/messageService';
import { successResponse, errorResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getMessages = async (req: AuthRequest, res: ServerResponse, roomId: string): Promise<void> => {
  try {
    if (!roomId) {
      errorResponse(res, 'Room ID is required', 400);
      return;
    }

    const messages = await fetchMessages(roomId);
    successResponse(res, messages, 200);
  } catch (error: any) {
    errorResponse(res, error.message, 400);
  }
};
