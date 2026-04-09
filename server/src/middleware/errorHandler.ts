import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors — return field-level messages, not the full schema
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  const appErr = err as AppError;
  const statusCode = appErr.statusCode ?? 500;
  const message    = appErr.message ?? 'Internal Server Error';

  // Log 5xx errors with full stack
  if (statusCode >= 500) {
    logger.error('Unhandled server error', { statusCode, message, stack: appErr.stack });
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace in development
    ...(env.NODE_ENV === 'development' && { stack: appErr.stack }),
  });
}

export function createError(message: string, statusCode: number): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}
