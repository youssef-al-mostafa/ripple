import { IncomingMessage, ServerResponse } from 'http';

export const logger = (req: IncomingMessage, res: ServerResponse, next: () => void): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};
