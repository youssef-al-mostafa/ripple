import { IncomingMessage, ServerResponse } from 'http';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends IncomingMessage {
  user?: {
    userId: string;
  };
}

export const verifyAuth = (req: AuthRequest, res: ServerResponse, next: () => void): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'No token provided' }));
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Invalid token' }));
  }
};
