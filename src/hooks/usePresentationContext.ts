import { createContext, useContext } from 'react';
import type { PresentationData } from '@/types/presentation';

interface PresentationContextType {
  data: PresentationData | null;
  setData: (data: PresentationData) => Promise<void>;
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const PresentationContext = createContext<PresentationContextType | null>(null);

export function usePresentationContext() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentationContext must be used within a PresentationProvider');
  }
  return context;
}