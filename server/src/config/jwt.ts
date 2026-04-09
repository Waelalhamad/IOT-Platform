import jwt from 'jsonwebtoken';
import { env } from './env';
import { JwtPayload } from '../middleware/authMiddleware';

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: Pick<JwtPayload, 'userId'>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): Pick<JwtPayload, 'userId'> {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as Pick<JwtPayload, 'userId'>;
}

export function issueTokenPair(userId: string, email: string) {
  const accessToken = signAccessToken({ userId, email });
  const refreshToken = signRefreshToken({ userId });
  return { accessToken, refreshToken };
}
