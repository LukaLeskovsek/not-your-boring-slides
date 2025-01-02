import { create } from 'zustand';
import type { PresentationData } from '@/types/presentation';
import { PresentationService } from '@/services/api/presentation';

interface PresentationState {
  data: PresentationData | null;
  isLoading: boolean;
  error: Error | null;
  currentSlideIndex: number;
  actions: {
    fetchPresentation: () => Promise<void>;
    savePresentation: (data: PresentationData) => Promise<void>;
    updateSlide: (slideIndex: number, slideData: PresentationData['slides'][0]) => Promise<void>;
    setCurrentSlide: (index: number) => void;
  };
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  currentSlideIndex: 0,
  actions: {
    fetchPresentation: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await PresentationService.fetchPresentation();
        set({ data, isLoading: false });
      } catch (error) {
        set({ error: error as Error, isLoading: false });
      }
    },

    savePresentation: async (data: PresentationData) => {
      set({ isLoading: true, error: null });
      try {
        await PresentationService.savePresentation(data);
        set({ data, isLoading: false });
      } catch (error) {
        set({ error: error as Error, isLoading: false });
      }
    },

    updateSlide: async (slideIndex: number, slideData: PresentationData['slides'][0]) => {
      set({ isLoading: true, error: null });
      try {
        await PresentationService.updateSlide(slideIndex, slideData);
        const currentData = get().data;
        if (currentData) {
          const newSlides = [...currentData.slides];
          newSlides[slideIndex] = slideData;
          set({ 
            data: { ...currentData, slides: newSlides },
            isLoading: false 
          });
        }
      } catch (error) {
        set({ error: error as Error, isLoading: false });
      }
    },

    setCurrentSlide: (index: number) => {
      set({ currentSlideIndex: index });
    },
  },
})); 