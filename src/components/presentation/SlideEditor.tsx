import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ISlide, SlideEffect, SlideType, EffectType } from '@/types/presentation';

interface SlideEditorProps {
  slide: ISlide;
  onSave: (slide: ISlide) => void;
}

const SLIDE_TYPES = [
  { value: 'header-only', label: 'Header Only' },
  { value: 'title-content', label: 'Title with Content' },
  { value: 'image-only', label: 'Image Only' },
  { value: 'gif-only', label: 'GIF Only' },
  { value: 'image-header', label: 'Image with Header' },
  { value: 'gif-header', label: 'GIF with Header' },
  { value: 'pie-chart', label: 'Pie Chart' },
  { value: 'progress-grid', label: 'Progress Grid' },
  { value: 'markdown', label: 'Markdown' },
];

const FontSizeSelector = ({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) => (
  <div className="space-y-4">
    <Label>Content Font Size</Label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sm">Small</SelectItem>
        <SelectItem value="md">Medium</SelectItem>
        <SelectItem value="lg">Large</SelectItem>
        <SelectItem value="xl">Extra Large</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export function SlideEditor({ slide, onSave }: SlideEditorProps) {
  const [editedSlide, setEditedSlide] = useState<ISlide>(slide);
  const [showEffectOptions, setShowEffectOptions] = useState(!!slide.effect);

  useEffect(() => {
    setEditedSlide(slide);
    setShowEffectOptions(!!slide.effect);
  }, [slide]);

  const handleTypeChange = (type: SlideType) => {
    setEditedSlide(prev => ({ ...prev, type }));
  };

  const handleEffectToggle = (enabled: boolean) => {
    setShowEffectOptions(enabled);
    if (!enabled) {
      setEditedSlide(prev => ({ ...prev, effect: undefined }));
    } else {
      setEditedSlide(prev => ({
        ...prev,
        effect: {
          type: 'flying-emoji',
          options: {
            particleCount: 10,
            emoji: '✨',
            duration: 3,
            fadeOut: 0.7,
          },
        },
      }));
    }
  };

  const handleEffectChange = (effect: Partial<SlideEffect>) => {
    setEditedSlide(prev => ({
      ...prev,
      effect: {
        ...prev.effect,
        ...effect,
      } as SlideEffect,
    }));
  };

  const handleSave = () => {
    onSave(editedSlide);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-white">
        <h2 className="text-lg font-semibold">Edit Slide</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Label>Slide Type</Label>
            <Select value={editedSlide.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SLIDE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(editedSlide.type === 'header-only' || 
            editedSlide.type === 'title-content' || 
            editedSlide.type === 'image-header' || 
            editedSlide.type === 'gif-header' ||
            editedSlide.type === 'pie-chart' ||
            editedSlide.type === 'progress-grid') && (
            <div className="space-y-4">
              <Label>Header</Label>
              <Input
                value={editedSlide.header || ''}
                onChange={e => setEditedSlide(prev => ({ ...prev, header: e.target.value }))}
                placeholder="Enter slide header"
              />
            </div>
          )}

          <FontSizeSelector 
            value={editedSlide.fontSize || 'md'} 
            onValueChange={(fontSize) => setEditedSlide(prev => ({ ...prev, fontSize }))}
          />

          {editedSlide.type === 'title-content' && (
            <div className="space-y-4">
              <Label>Content</Label>
              <Textarea
                value={editedSlide.content || ''}
                onChange={e => setEditedSlide(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter slide content"
                rows={5}
              />
            </div>
          )}

          {editedSlide.type === 'markdown' && (
            <div className="space-y-4">
              <Label>Markdown Content</Label>
              <Textarea
                value={editedSlide.markdown || ''}
                onChange={e => setEditedSlide(prev => ({ ...prev, markdown: e.target.value }))}
                placeholder="Enter markdown content"
                rows={10}
              />
            </div>
          )}

          {editedSlide.type === 'pie-chart' && (
            <div className="space-y-4">
              <Label>Chart Data (JSON)</Label>
              <Textarea
                value={editedSlide.chartDataText || JSON.stringify(editedSlide.chartData || [], null, 2)}
                onChange={e => {
                  const text = e.target.value;
                  setEditedSlide(prev => ({ ...prev, chartDataText: text }));
                }}
                onBlur={e => {
                  try {
                    const chartData = JSON.parse(e.target.value);
                    setEditedSlide(prev => ({ 
                      ...prev, 
                      chartData,
                      chartDataText: undefined
                    }));
                  } catch (err) {
                    // Keep the invalid text in chartDataText
                  }
                }}
                placeholder={`[
  {
    "label": "Item 1",
    "value": 30,
    "color": "#ff0000"
  }
]`}
                rows={10}
              />
            </div>
          )}

          {editedSlide.type === 'progress-grid' && (
            <div className="space-y-4">
              <Label>Progress Data (JSON)</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Supported colors: bg-{'{color}'}-{'{shade}'} (e.g., bg-purple-500, bg-green-500, bg-blue-500)
              </div>
              <Textarea
                value={editedSlide.progressDataText || JSON.stringify(editedSlide.progressData || [], null, 2)}
                onChange={e => {
                  const text = e.target.value;
                  setEditedSlide(prev => ({ ...prev, progressDataText: text }));
                }}
                onBlur={e => {
                  try {
                    const progressData = JSON.parse(e.target.value);
                    setEditedSlide(prev => ({ 
                      ...prev, 
                      progressData,
                      progressDataText: undefined
                    }));
                  } catch (err) {
                    // Keep the invalid text in progressDataText
                  }
                }}
                placeholder={`[
  {
    "label": "Task 1",
    "value": 75,
    "color": "bg-purple-500",
    "size": "md"
  },
  {
    "label": "Task 2",
    "value": 50,
    "color": "bg-green-500",
    "size": "md"
  }
]`}
                rows={10}
              />
            </div>
          )}

          {(editedSlide.type === 'image-only' || editedSlide.type === 'image-header') && (
            <div className="space-y-4">
              <Label>Image URL</Label>
              <Input
                value={editedSlide.imageUrl || ''}
                onChange={e => setEditedSlide(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Enter image URL"
              />
              <Label>Alt Text</Label>
              <Input
                value={editedSlide.altText || ''}
                onChange={e => setEditedSlide(prev => ({ ...prev, altText: e.target.value }))}
                placeholder="Enter alt text"
              />
            </div>
          )}

          {(editedSlide.type === 'gif-only' || editedSlide.type === 'gif-header') && (
            <div className="space-y-4">
              <Label>GIF URL</Label>
              <Input
                value={editedSlide.gifUrl || ''}
                onChange={e => setEditedSlide(prev => ({ ...prev, gifUrl: e.target.value }))}
                placeholder="Enter GIF URL"
              />
              <Label>Alt Text</Label>
              <Input
                value={editedSlide.altText || ''}
                onChange={e => setEditedSlide(prev => ({ ...prev, altText: e.target.value }))}
                placeholder="Enter alt text"
              />
            </div>
          )}

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Label>Enable Slide Effect</Label>
              <Switch
                checked={showEffectOptions}
                onCheckedChange={handleEffectToggle}
              />
            </div>

            {showEffectOptions && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Effect Type</Label>
                  <Select
                    value={editedSlide.effect?.type || 'flying-emoji'}
                    onValueChange={(type: EffectType) => handleEffectChange({ type })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flying-emoji">Flying Emoji</SelectItem>
                      <SelectItem value="confetti">Confetti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editedSlide.effect?.type === 'flying-emoji' && (
                  <>
                    <div className="space-y-2">
                      <Label>Emoji</Label>
                      <Input
                        value={editedSlide.effect.options?.emoji || '✨'}
                        onChange={e =>
                          handleEffectChange({
                            options: { ...editedSlide.effect?.options, emoji: e.target.value },
                          })
                        }
                        placeholder="Enter emoji"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Particle Count ({editedSlide.effect.options?.particleCount || 10})</Label>
                      <Slider
                        value={[editedSlide.effect.options?.particleCount || 10]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={([value]) =>
                          handleEffectChange({
                            options: { ...editedSlide.effect?.options, particleCount: value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration ({editedSlide.effect.options?.duration || 3}s)</Label>
                      <Slider
                        value={[editedSlide.effect.options?.duration || 3]}
                        min={1}
                        max={10}
                        step={0.5}
                        onValueChange={([value]) =>
                          handleEffectChange({
                            options: { ...editedSlide.effect?.options, duration: value },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {editedSlide.effect?.type === 'confetti' && (
                  <>
                    <div className="space-y-2">
                      <Label>Particle Count ({editedSlide.effect.options?.particleCount || 80})</Label>
                      <Slider
                        value={[editedSlide.effect.options?.particleCount || 80]}
                        min={20}
                        max={200}
                        step={10}
                        onValueChange={([value]) =>
                          handleEffectChange({
                            options: { ...editedSlide.effect?.options, particleCount: value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Spread ({editedSlide.effect.options?.spread || 60})</Label>
                      <Slider
                        value={[editedSlide.effect.options?.spread || 60]}
                        min={20}
                        max={180}
                        step={10}
                        onValueChange={([value]) =>
                          handleEffectChange({
                            options: { ...editedSlide.effect?.options, spread: value },
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-white">
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
} 