import { ServerResponse } from 'http';

export const handleError = (error: any, res: ServerResponse): void => {
  console.error('Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: message }));
};
