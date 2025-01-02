import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/lib/errors/AppError';

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  res.status(statusCode).json({
    error: error.message || 'Internal Server Error'
  });
}; 