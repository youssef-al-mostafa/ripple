import { IncomingMessage, ServerResponse } from 'http';
import { register, login } from '../controllers/authController';
import { getMessages } from '../controllers/messageController';
import { getProfile } from '../controllers/userController';
import { verifyAuth, AuthRequest } from '../middleware/auth';
import { errorResponse } from '../utils/response';

interface Route {
  method: string;
  path: string;
  handler: (req: any, res: ServerResponse, body?: any, params?: any) => Promise<void>;
  protected?: boolean;
}

const routes: Route[] = [
  { method: 'POST', path: '/api/auth/register', handler: async (req, res, body) => await register(body, res) },
  { method: 'POST', path: '/api/auth/login', handler: async (req, res, body) => await login(body, res) },
  { method: 'GET', path: '/api/user/profile', handler: getProfile, protected: true },
  { method: 'GET', path: '/api/messages', handler: async (req, res, body, params) => await getMessages(req, res, params.roomId), protected: true },
];

export const handleRoute = async (req: IncomingMessage, res: ServerResponse, pathname: string, body: any): Promise<boolean> => {
  const method = req.method || 'GET';

  for (const route of routes) {
    if (route.method === method && matchPath(route.path, pathname)) {
      if (route.protected) {
        return new Promise((resolve) => {
          verifyAuth(req as AuthRequest, res, async () => {
            try {
              const params = extractParams(pathname);
              await route.handler(req, res, body, params);
              resolve(true);
            } catch (error: any) {
              errorResponse(res, error.message, 500);
              resolve(true);
            }
          });
        });
      } else {
        try {
          const params = extractParams(pathname);
          await route.handler(req, res, body, params);
          return true;
        } catch (error: any) {
          errorResponse(res, error.message, 500);
          return true;
        }
      }
    }
  }

  return false;
};

const matchPath = (routePath: string, requestPath: string): boolean => {
  return routePath === requestPath || requestPath.startsWith(routePath);
};

const extractParams = (pathname: string): any => {
  const url = new URL(`http://localhost${pathname}`);
  const params: any = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};
