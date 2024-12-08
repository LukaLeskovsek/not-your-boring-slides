import { useState } from 'react';
import { PresentationEditor } from '@/components/presentation/PresentationEditor';
import type { PresentationData } from '@/types/presentation';

// Default presentation data template
const defaultPresentationData: PresentationData = {
  documentName: 'Untitled Presentation',
  settings: {
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    gradientBackground: {
      from: '#a5f3fc',
      to: '#fbcfe8',
    },
    footer: {
      logoUrl: '/logo.svg',
      dateFormat: 'MMM yyyy',
    },
    date: new Date().toISOString().split('T')[0],
  },
  slides: [
    {
      type: 'header-only',
      header: 'Welcome to Your Presentation',
      effect: {
        type: 'flying-emoji',
        options: {
          particleCount: 15,
          emoji: '✨',
          duration: 3,
          fadeOut: 0.7,
        },
      },
    },
  ],
};

export default function EditorPage() {
  const [presentationData, setPresentationData] = useState<PresentationData>(() => {
    // In a real application, you might want to load the data from localStorage or an API
    return defaultPresentationData;
  });

  const handleSave = async (data: PresentationData) => {
    // In a real application, you would save this to your backend or localStorage
    console.log('Saving presentation:', data);
    setPresentationData(data);

    // Save to localStorage as an example
    try {
      localStorage.setItem('presentation-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving presentation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PresentationEditor data={presentationData} onSave={handleSave} />
    </div>
  );
} 