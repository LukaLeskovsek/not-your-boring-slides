import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlideEditor } from './SlideEditor';
import { Slide } from './Slide';
import type { ISlide, PresentationData } from '@/types/presentation';
import { cn } from '@/lib/utils';
import { usePresentationContext } from '@/hooks/usePresentationContext';

export function PresentationEditor() {
  const { data: presentationData, updatePresentation, isLoading } = usePresentationContext();
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!presentationData) {
    return <div>No presentation data available</div>;
  }

  const handleSlideSelect = (id: string) => {
    setSelectedSlideId(id);
  };

  const handleSlideUpdate = (updatedSlide: ISlide) => {
    if (!selectedSlideId) return;

    const updatedSlides = presentationData.slides.map(slide =>
      slide.id === selectedSlideId ? updatedSlide : slide
    );

    updatePresentation({
      ...presentationData,
      slides: updatedSlides,
    });
  };

  const handleAddSlide = () => {
    const newSlide: ISlide = {
      id: crypto.randomUUID(),
      type: 'header-only',
      header: 'New Slide',
    };

    updatePresentation({
      ...presentationData,
      slides: [...presentationData.slides, newSlide],
    });
    setSelectedSlideId(newSlide.id);
  };

  const handleRemoveSlide = (id: string) => {
    updatePresentation({
      ...presentationData,
      slides: presentationData.slides.filter(slide => slide.id !== id),
    });
    if (selectedSlideId === id) {
      setSelectedSlideId(null);
    }
  };

  const handleSettingsChange = (field: keyof typeof presentationData.settings, value: string) => {
    updatePresentation({
      ...presentationData,
      settings: {
        ...presentationData.settings,
        [field]: value,
      },
    });
  };

  const handleGradientChange = (field: 'from' | 'to', value: string) => {
    updatePresentation({
      ...presentationData,
      settings: {
        ...presentationData.settings,
        gradientBackground: {
          ...presentationData.settings.gradientBackground,
          [field]: value,
        },
      },
    });
  };

  const handleFooterChange = (field: keyof typeof presentationData.settings.footer, value: string) => {
    updatePresentation({
      ...presentationData,
      settings: {
        ...presentationData.settings,
        footer: {
          ...presentationData.settings.footer,
          [field]: value,
        },
      },
    });
  };

  const selectedSlide = selectedSlideId 
    ? presentationData.slides.find(slide => slide.id === selectedSlideId)
    : null;

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Slides List & Settings */}
      <div className="w-64 border-r bg-gray-50/50 p-4 flex flex-col">
        <div className="space-y-4 mb-4">
          <Input
            value={presentationData.documentName}
            onChange={e => updatePresentation({ ...presentationData, documentName: e.target.value })}
            placeholder="Presentation Name"
          />
          <Button onClick={handleAddSlide} className="w-full">
            Add Slide
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {presentationData.slides.map((slide) => (
              <Card
                key={slide.id}
                className={cn(
                  'p-3 cursor-pointer hover:bg-gray-100 transition-colors relative group',
                  selectedSlideId === slide.id && 'ring-2 ring-primary'
                )}
                onClick={() => handleSlideSelect(slide.id)}
              >
                <div className="text-sm font-medium truncate">
                  {slide.header || `Slide ${slide.id.slice(0, 4)}`}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {slide.type}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveSlide(slide.id);
                  }}
                >
                  <i className="fi fi-rr-trash text-red-500"></i>
                </Button>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <Card className="mt-4 p-4 space-y-4">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Input
              value={presentationData.settings.fontSize}
              onChange={e => handleSettingsChange('fontSize', e.target.value)}
              placeholder="16px"
            />
          </div>
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Input
              value={presentationData.settings.fontFamily}
              onChange={e => handleSettingsChange('fontFamily', e.target.value)}
              placeholder="Inter, sans-serif"
            />
          </div>
          <div className="space-y-2">
            <Label>Background Gradient</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={presentationData.settings.gradientBackground.from}
                onChange={e => handleGradientChange('from', e.target.value)}
                placeholder="From Color"
              />
              <Input
                value={presentationData.settings.gradientBackground.to}
                onChange={e => handleGradientChange('to', e.target.value)}
                placeholder="To Color"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Footer Logo URL</Label>
            <Input
              value={presentationData.settings.footer.logoUrl}
              onChange={e => handleFooterChange('logoUrl', e.target.value)}
              placeholder="Logo URL"
            />
          </div>
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Input
              value={presentationData.settings.footer.dateFormat}
              onChange={e => handleFooterChange('dateFormat', e.target.value)}
              placeholder="MMM yyyy"
            />
          </div>
          <div className="space-y-2">
            <Label>Presentation Date</Label>
            <Input
              type="date"
              value={presentationData.settings.date}
              onChange={e => handleSettingsChange('date', e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Middle Section - Slide Editor */}
      <div className="flex-1 border-r">
        {selectedSlide ? (
          <SlideEditor
            slide={selectedSlide}
            onSave={handleSlideUpdate}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a slide to edit
          </div>
        )}
      </div>

      {/* Right Section - Preview */}
      <div className="w-[calc(100vh*16/9*0.4)] bg-gray-50/50">
        {selectedSlide ? (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="w-full aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
              <Slide
                slide={selectedSlide}
                preview={true}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a slide to preview
          </div>
        )}
      </div>
    </div>
  );
} 