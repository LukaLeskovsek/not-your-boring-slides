import { useState, useCallback } from 'react';
import type { PresentationData } from '@/types/presentation';
import { PresentationContext } from '@/hooks/usePresentationContext';

interface PresentationProviderProps {
  data: PresentationData;
  onSave: (data: PresentationData) => Promise<void>;
  children: React.ReactNode;
}

export function PresentationProvider({ data: initialData, onSave, children }: PresentationProviderProps) {
  const [data, setData] = useState<PresentationData>(initialData);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fontSize, setFontSize] = useState(data.settings.fontSize);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const updatePresentationData = useCallback(async (newData: PresentationData) => {
    try {
      await onSave(newData);
      setData(newData);
    } catch (err) {
      console.error('Failed to save presentation:', err);
      // You might want to show an error toast here
    }
  }, [onSave]);

  return (
    <PresentationContext.Provider
      value={{
        data,
        setData: updatePresentationData,
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