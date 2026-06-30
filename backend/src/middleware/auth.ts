import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types/express';
import { verifyToken } from '@/utils/jwt';
import { errorResponse } from '@/utils/response';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'Access token required', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error: any) {
    return errorResponse(res, 'Invalid token', 401);
  }
}

export function authorizeRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden', 403);
    }

    return next();
  };
}
