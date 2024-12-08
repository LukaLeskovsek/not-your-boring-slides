import { useContext } from 'react';
import { PresentationContext } from '@/components/presentation/PresentationProvider';

export function usePresentationContext() {
  const context = useContext(PresentationContext);
  
  if (!context) {
    throw new Error('usePresentationContext must be used within a PresentationProvider');
  }
  
  return context;
}