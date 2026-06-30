import jwt from 'jsonwebtoken';
import { AuthTokens } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret_key';
const JWT_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

export function generateTokens(payload: { userId: string; email: string; role: string }): AuthTokens {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
  
  return { token, refreshToken };
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
