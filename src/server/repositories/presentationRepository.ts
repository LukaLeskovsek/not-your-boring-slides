import { promises as fs } from 'fs';
import path from 'path';
import type { PresentationData } from '@/types/presentation';
import { AppError } from '@/lib/errors/AppError';

export class PresentationRepository {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'public', 'presentation.json');
    console.log('[Constructor: PresentationRepository] Initialized with data path:', this.dataPath);
  }

  private async ensureDataDirectory(): Promise<void> {
    const dir = path.dirname(this.dataPath);
    console.log('[PresentationRepository] Ensuring public directory exists:', dir);
    try {
      await fs.access(dir);
      console.log('[PresentationRepository] Public directory exists');
    } catch {
      console.log('[PresentationRepository] Creating public directory');
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async getPresentation(): Promise<PresentationData> {
    console.log('[PresentationRepository] Reading presentation from:', this.dataPath);
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      console.log('[PresentationRepository] Raw file contents:', data.substring(0, 200) + '...');
      console.log('[PresentationRepository] Successfully read presentation file');
      try {
        console.log('[PresentationRepository] Attempting to parse JSON');
        const parsedData = JSON.parse(data) as PresentationData;
        console.log('[PresentationRepository] Successfully parsed presentation data:', {
          documentName: parsedData.documentName,
          slideCount: parsedData.slides.length,
          settingsPresent: !!parsedData.settings,
          slidesIsArray: Array.isArray(parsedData.slides)
        });
        return parsedData;
      } catch (parseError) {
        console.error('[PresentationRepository] Error parsing presentation data:', parseError);
        console.error('[PresentationRepository] Invalid JSON structure. Full file contents:', data);
        throw new AppError('Failed to parse presentation data', 500);
      }
    } catch (error) {
      console.error('[PresentationRepository] Error reading presentation file:', error);
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.error('[PresentationRepository] File not found at path:', this.dataPath);
        throw new AppError('Presentation not found', 404);
      }
      console.error('[PresentationRepository] Unexpected error type:', typeof error);
      console.error('[PresentationRepository] Error properties:', Object.keys(error as object));
      throw new AppError('Failed to read presentation data', 500);
    }
  }

  async savePresentation(data: PresentationData): Promise<void> {
    console.log('[PresentationRepository] Saving presentation');
    try {
      await this.ensureDataDirectory();
      console.log('[PresentationRepository] Writing presentation to:', this.dataPath);
      await fs.writeFile(
        this.dataPath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );
      console.log('[PresentationRepository] Successfully saved presentation');
    } catch (error) {
      console.error('[PresentationRepository] Error saving presentation:', error);
      throw new AppError('Failed to save presentation data', 500);
    }
  }

  async updateSlide(index: number, slideData: PresentationData['slides'][0]): Promise<void> {
    console.log('[PresentationRepository] Updating slide at index:', index);
    try {
      const presentation = await this.getPresentation();
      
      if (index < 0 || index >= presentation.slides.length) {
        console.error('[PresentationRepository] Slide index out of bounds:', index);
        throw new AppError('Slide index out of bounds', 400);
      }

      presentation.slides[index] = slideData;
      console.log('[PresentationRepository] Saving updated presentation with modified slide');
      await this.savePresentation(presentation);
      console.log('[PresentationRepository] Successfully updated slide');
    } catch (error) {
      console.error('[PresentationRepository] Error updating slide:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update slide', 500);
    }
  }
} 