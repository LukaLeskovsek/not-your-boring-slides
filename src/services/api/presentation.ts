import type { PresentationData } from '@/types/presentation';
import { AppError } from '@/lib/errors/AppError';

const API_BASE_URL = '/api';

export class PresentationService {
  static async fetchPresentation(): Promise<PresentationData> {
    try {
      const response = await fetch(`${API_BASE_URL}/presentation`);
      if (!response.ok) {
        throw new AppError('Failed to fetch presentation', response.status);
      }
      return response.json();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch presentation', 500);
    }
  }

  static async savePresentation(data: PresentationData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/presentation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new AppError('Failed to save presentation', response.status);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to save presentation', 500);
    }
  }

  static async updateSlide(slideIndex: number, slideData: PresentationData['slides'][0]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/presentation/slides/${slideIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });
      
      if (!response.ok) {
        throw new AppError('Failed to update slide', response.status);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update slide', 500);
    }
  }
} 