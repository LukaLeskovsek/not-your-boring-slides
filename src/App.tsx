import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import type { PresentationData } from '@/types/presentation';
import { PresentationProvider } from '@/components/presentation/PresentationProvider';
import { PresentationViewer } from '@/components/presentation/PresentationViewer';
import EditorPage from '@/pages/editor';

function App() {
  const [data, setData] = useState<PresentationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPresentation = async () => {
      console.log('[App] Starting to load presentation');
      try {
        const response = await fetch('/api/presentation');
        console.log('[App] Fetch response status:', response.status);
        
        if (!response.ok) {
          console.error('[App] Failed to load presentation - HTTP Error:', response.status);
          const errorText = await response.text();
          console.error('[App] Error response body:', errorText);
          throw new Error('Failed to load presentation');
        }
        
        const presentationData = await response.json();
        console.log('[App] Successfully loaded presentation:', {
          documentName: presentationData.documentName,
          slideCount: presentationData.slides.length
        });
        setData(presentationData);
      } catch (err) {
        console.error('[App] Error loading presentation:', err);
        setError('Failed to load presentation data');
      }
    };

    loadPresentation();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading presentation...</p>
      </div>
    );
  }

  const handleSave = async (newData: PresentationData) => {
    console.log('[App] Starting to save presentation');
    try {
      const response = await fetch('/api/presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      
      console.log('[App] Save response status:', response.status);
      
      if (!response.ok) {
        console.error('[App] Failed to save presentation - HTTP Error:', response.status);
        const errorText = await response.text();
        console.error('[App] Error response body:', errorText);
        throw new Error('Failed to save presentation');
      }
      
      console.log('[App] Successfully saved presentation');
      setData(newData);
    } catch (err) {
      console.error('[App] Error saving presentation:', err);
      throw err;
    }
  };

  return (
    <BrowserRouter>
      <PresentationProvider 
        data={data} 
        onSave={handleSave}
        isLoading={!data && !error}
      >
        <AppContent />
      </PresentationProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Link
          to={location.pathname === '/editor' ? '/' : '/editor'}
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 px-4 py-2 rounded-md shadow-sm border flex items-center gap-2"
        >
          {location.pathname === '/editor' ? (
            <>
              <i className="fi fi-rr-play text-lg"></i>
              
            </>
          ) : (
            <>
              <i className="fi fi-rr-edit text-lg"></i>            </>
          )}
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<PresentationViewer />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;