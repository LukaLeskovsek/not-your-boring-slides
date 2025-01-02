import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/lib/errors/AppError';
import type { PresentationData } from '@/types/presentation';

export const validatePresentation = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body as PresentationData;
  if (!data || !data.slides || !Array.isArray(data.slides)) {
    return next(new AppError('Invalid presentation data', 400));
  }
  next();
};

export const validateSlide = (req: Request, res: Response, next: NextFunction) => {
  const slide = req.body;
  if (!slide || !slide.type) {
    return next(new AppError('Invalid slide data', 400));
  }
  next();
}; 