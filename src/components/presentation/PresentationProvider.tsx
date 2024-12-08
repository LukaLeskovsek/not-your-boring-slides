import { createContext, useCallback, useState } from 'react';
import type { PresentationData } from '@/types/presentation';

interface PresentationContextType {
  data: PresentationData | null;
  isLoading: boolean;
  updatePresentation: (newData: PresentationData) => void;
  updateSlide: (updatedSlide: PresentationData['slides'][0]) => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
}

export const PresentationContext = createContext<PresentationContextType>({
  data: null,
  isLoading: true,
  updatePresentation: () => {},
  updateSlide: () => {},
  currentSlideIndex: 0,
  setCurrentSlideIndex: () => {},
  fontSize: '16px',
  setFontSize: () => {},
  isFullscreen: false,
  toggleFullscreen: async () => {},
});

interface PresentationProviderProps {
  children: React.ReactNode;
  data: PresentationData | null;
  onSave: (data: PresentationData) => void;
  isLoading: boolean;
}

export function PresentationProvider({ children, data, onSave, isLoading }: PresentationProviderProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fontSize, setFontSize] = useState('16px');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const updatePresentation = useCallback((newData: PresentationData) => {
    onSave(newData);
  }, [onSave]);

  const updateSlide = useCallback((updatedSlide: PresentationData['slides'][0]) => {
    if (!data) return;
    
    const newSlides = data.slides.map(slide => 
      slide === updatedSlide ? updatedSlide : slide
    );
    
    onSave({
      ...data,
      slides: newSlides,
    });
  }, [data, onSave]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <PresentationContext.Provider 
      value={{ 
        data, 
        isLoading, 
        updatePresentation, 
        updateSlide,
        currentSlideIndex,
        setCurrentSlideIndex,
        fontSize,
        setFontSize,
        isFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}