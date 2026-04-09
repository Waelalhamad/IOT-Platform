import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { issueTokenPair, verifyRefreshToken } from '../config/jwt';
import { createError } from '../middleware/errorHandler';
import { env } from '../config/env';

const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const exists = await User.findOne({ email });
    if (exists) throw createError('Email already registered', 409);

    const user = await User.create({ email, password });
    const { accessToken, refreshToken } = issueTokenPair(user._id.toString(), user.email);

    await User.updateOne({ _id: user._id }, { refreshToken });

    res.cookie('refresh_token', refreshToken, cookieOptions);
    res.status(201).json({
      success: true,
      data: { accessToken, user },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) throw createError('Invalid credentials', 401);

    const valid = await user.comparePassword(password);
    if (!valid) throw createError('Invalid credentials', 401);

    const { accessToken, refreshToken } = issueTokenPair(user._id.toString(), user.email);
    await User.updateOne({ _id: user._id }, { refreshToken });

    res.cookie('refresh_token', refreshToken, cookieOptions);
    res.json({
      success: true,
      data: { accessToken, user },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) throw createError('No refresh token', 401);

    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw createError('Invalid refresh token', 401);
    }

    const user = await User.findById(payload.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw createError('Refresh token reuse detected', 401);
    }

    const { accessToken, refreshToken } = issueTokenPair(user._id.toString(), user.email);
    await User.updateOne({ _id: user._id }, { refreshToken });

    res.cookie('refresh_token', refreshToken, cookieOptions);
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      await User.updateOne({ refreshToken: token }, { refreshToken: null });
    }
    res.clearCookie('refresh_token');
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}
