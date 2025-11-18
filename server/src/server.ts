import http from 'http';
import url from 'url';
import WebSocket from 'ws';
import { connectDatabase } from './config/database';
import { ENV } from './config/env';
import { handleRoute } from './routes/router';
import { logger } from './middleware/logger';
import { handleError } from './middleware/errorHandler';
import { errorResponse } from './utils/response';
import { handleWebSocketConnection, startHeartbeat } from './websocket/handler';

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  logger(req, res, async () => {
    try {
      const parsedUrl = url.parse(req.url || '', true);
      const pathname = parsedUrl.pathname || '/';

      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};

          const handled = await handleRoute(req, res, pathname, jsonBody);

          if (!handled) {
            errorResponse(res, 'Route not found', 404);
          }
        } catch (error: any) {
          handleError(error, res);
        }
      });

      req.on('error', (error) => {
        handleError(error, res);
      });

    } catch (error: any) {
      handleError(error, res);
    }
  });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', handleWebSocketConnection);

startHeartbeat(wss);

const startServer = async () => {
  try {
    await connectDatabase();

    const PORT = parseInt(ENV.PORT, 10);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server running`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
