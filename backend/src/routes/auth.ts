import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/client';
import { registerSchema, loginSchema } from '../utils/validation';
import { generateTokens, verifyRefreshToken, verifyToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { AuthRequest } from '@/types/express';

const router = Router();

function normalizeUsername(value?: string) {
  return value
    ? value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')
    : '';
}

async function createUniqueUsername(email: string, firstName?: string, lastName?: string) {
  const baseUsername = normalizeUsername(
    firstName && lastName ? `${firstName}.${lastName}` : email.split('@')[0]
  ).slice(0, 20) || `user${Math.floor(Math.random() * 10000)}`;
  let username = baseUsername;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername}${suffix}`.slice(0, 30);
    suffix += 1;
  }

  return username;
}

function getTokenFromRequest(req: Request) {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader === 'string') {
    const token = authHeader.split(' ')[1];
    if (token) return token;
  }

  const cookieHeader = req.headers.cookie;
  if (typeof cookieHeader === 'string') {
    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'token' || name === 'accessToken') {
        return decodeURIComponent(value);
      }
    }
  }

  return null;
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const payload = registerSchema.parse(req.body);
    const { email, password, username, firstName, lastName } = payload;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: username
          ? [{ email }, { username }]
          : [{ email }],
      },
    });

    if (existingUser) {
      return errorResponse(res, 'User with this email or username already exists', 409);
    }

    const generatedUsername = username || (await createUniqueUsername(email, firstName, lastName));
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username: generatedUsername,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const tokens = generateTokens({ userId: user.id, email: user.email, role: 'user' });
    const { password: _password, ...safeUser } = user;

    return successResponse(res, {
      user: {
        ...safeUser,
        role: 'user',
      },
      token: tokens.token,
      refreshToken: tokens.refreshToken,
    });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Registration failed', 400);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.parse(req.body);
    const { email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const tokens = generateTokens({ userId: user.id, email: user.email, role: 'user' });
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    const { password: _password, ...safeUser } = user;

    return successResponse(res, {
      user: {
        ...safeUser,
        role: 'user',
      },
      token: tokens.token,
      refreshToken: tokens.refreshToken,
    });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Login failed', 400);
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(res, 'Refresh token required', 400);
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }

    const tokens = generateTokens({ userId: user.id, email: user.email, role: 'user' });
    return successResponse(res, tokens);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Token refresh failed', 401);
  }
});

router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return errorResponse(res, 'Access token required', 401);
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    const { password: _password, ...safeUser } = user;

    return successResponse(res, {
      ...safeUser,
      role: 'user',
    });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to fetch current user', 401);
  }
});

router.post('/logout', async (_req: Request, res: Response) => {
  return successResponse(res, { message: 'Logout successful' });
});

export default router;
