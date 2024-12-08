import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SlideEditor } from './SlideEditor';
import { Slide } from './Slide';
import type { ISlide, PresentationData } from '@/types/presentation';
import { cn } from '@/lib/utils';
import { usePresentationContext } from '@/hooks/usePresentationContext';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Strict mode fix for react-beautiful-dnd
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

export function PresentationEditor() {
  const { data: presentationData, updatePresentation, isLoading } = usePresentationContext();
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!presentationData) {
    return <div>No presentation data available</div>;
  }

  const renumberSlides = (slides: ISlide[]): ISlide[] => {
    return slides.map((slide, index) => ({
      ...slide,
      id: String(index + 1)
    }));
  };

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
      slides: renumberSlides(updatedSlides),
    });
  };

  const handleAddSlide = () => {
    const newSlide: ISlide = {
      id: String(presentationData.slides.length + 1),
      type: 'header-only',
      header: 'New Slide',
    };

    const updatedSlides = [...presentationData.slides, newSlide];
    updatePresentation({
      ...presentationData,
      slides: renumberSlides(updatedSlides),
    });
    setSelectedSlideId(newSlide.id);
  };

  const handleRemoveSlide = (id: string) => {
    const filteredSlides = presentationData.slides.filter(slide => slide.id !== id);
    updatePresentation({
      ...presentationData,
      slides: renumberSlides(filteredSlides),
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !presentationData) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newSlides = Array.from(presentationData.slides);
    const [removed] = newSlides.splice(sourceIndex, 1);
    newSlides.splice(destinationIndex, 0, removed);

    const reorderedSlides = renumberSlides(newSlides);
    
    updatePresentation({
      ...presentationData,
      slides: reorderedSlides,
    });
  };

  const selectedSlide = selectedSlideId 
    ? presentationData.slides.find(slide => slide.id === selectedSlideId)
    : null;

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Slides List & Settings */}
      <div className="w-64 border-r bg-gray-50/50 flex flex-col">
        <div className="p-4 space-y-4">
          <Input
            value={presentationData.documentName}
            onChange={e => updatePresentation({ ...presentationData, documentName: e.target.value })}
            placeholder="Presentation Name"
          />
          <Button onClick={handleAddSlide} className="w-full">
            Add Slide
          </Button>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <StrictModeDroppable droppableId="slides">
                  {(provided: any) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {presentationData.slides.map((slide, index) => (
                        <Draggable
                          key={slide.id}
                          draggableId={slide.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                'rounded-lg',
                                snapshot.isDragging && 'ring-2 ring-primary'
                              )}
                            >
                              <Card
                                className={cn(
                                  'p-3 cursor-pointer hover:bg-gray-100 transition-colors relative group',
                                  selectedSlideId === slide.id && 'ring-2 ring-primary'
                                )}
                                onClick={() => handleSlideSelect(slide.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                  >
                                    ⋮⋮
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">
                                      {slide.header || `Slide ${slide.id}`}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                      {slide.type}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleRemoveSlide(slide.id);
                                    }}
                                  >
                                    <i className="fi fi-rr-trash text-red-500" />
                                  </Button>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </div>
            </ScrollArea>
          </div>
        </DragDropContext>

        <div className="p-4">
          <Collapsible
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between"
              >
                <span>Presentation Settings</span>
                <i className={cn(
                  "fi fi-rr-angle-small-down transition-transform duration-200",
                  isSettingsOpen && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
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
            </CollapsibleContent>
          </Collapsible>
        </div>
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