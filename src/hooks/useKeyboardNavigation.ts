import { useEffect } from 'react';
import { usePresentationContext } from './usePresentationContext';

export function useKeyboardNavigation() {
  const { data, currentSlideIndex, setCurrentSlideIndex } = usePresentationContext();

  useEffect(() => {
    if (!data) return;

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowLeft':
          if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
          }
          break;
        case 'ArrowRight':
        case ' ': // Spacebar
          if (currentSlideIndex < data.slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
          }
          // Prevent page scroll when using spacebar
          if (event.key === ' ') {
            event.preventDefault();
          }
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, data, setCurrentSlideIndex]);
}