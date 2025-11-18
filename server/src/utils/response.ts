import { ServerResponse } from 'http';

export const successResponse = (res: ServerResponse, data: any, statusCode: number = 200): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, data }));
};

export const errorResponse = (res: ServerResponse, message: string, statusCode: number = 400): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: message }));
};
