import { Request, Response, NextFunction } from 'express';
import { PresentationRepository } from '@/server/repositories/presentationRepository';
import { AppError } from '@/lib/errors/AppError';
import type { PresentationData } from '@/types/presentation';

export class PresentationController {
  private repository: PresentationRepository;

  constructor() {
    this.repository = new PresentationRepository();
  }

  getPresentation = async (req: Request, res: Response, next: NextFunction) => {
    console.log('[PresentationController] Fetching presentation');
    try {
      const presentation = await this.repository.getPresentation();
      console.log('[PresentationController] Successfully fetched presentation:', {
        documentName: presentation.documentName,
        slideCount: presentation.slides.length
      });
      res.json(presentation);
    } catch (error) {
      console.error('[PresentationController] Error fetching presentation:', error);
      next(new AppError('Failed to fetch presentation', 500));
    }
  };

  savePresentation = async (req: Request, res: Response, next: NextFunction) => {
    console.log('[PresentationController] Saving presentation');
    try {
      const presentationData = req.body as PresentationData;
      console.log('[PresentationController] Received presentation data:', {
        documentName: presentationData.documentName,
        slideCount: presentationData.slides.length
      });
      await this.repository.savePresentation(presentationData);
      console.log('[PresentationController] Successfully saved presentation');
      res.status(200).json({ message: 'Presentation saved successfully' });
    } catch (error) {
      console.error('[PresentationController] Error saving presentation:', error);
      next(new AppError('Failed to save presentation', 500));
    }
  };

  updateSlide = async (req: Request, res: Response, next: NextFunction) => {
    console.log('[PresentationController] Updating slide');
    try {
      const slideIndex = parseInt(req.params.index, 10);
      const slideData = req.body;
      
      console.log('[PresentationController] Updating slide at index:', slideIndex, 'with data:', {
        type: slideData.type,
        header: slideData.header
      });

      if (isNaN(slideIndex)) {
        console.error('[PresentationController] Invalid slide index:', req.params.index);
        throw new AppError('Invalid slide index', 400);
      }

      await this.repository.updateSlide(slideIndex, slideData);
      console.log('[PresentationController] Successfully updated slide at index:', slideIndex);
      res.status(200).json({ message: 'Slide updated successfully' });
    } catch (error) {
      console.error('[PresentationController] Error updating slide:', error);
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Failed to update slide', 500));
      }
    }
  };
} 