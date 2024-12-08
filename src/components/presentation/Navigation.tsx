import { Button } from '@/components/ui/button';
import { usePresentationContext } from '@/hooks/usePresentationContext';
import { Tooltip } from '@/components/ui/tooltip';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Navigation() {
  const { data, currentSlideIndex, setCurrentSlideIndex, toggleFullscreen, isFullscreen } =
    usePresentationContext();

  if (!data) return null;

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < data.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <TooltipProvider>
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentSlideIndex === 0}
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <i className="fi fi-rr-angle-left text-lg"></i>
              <span className="sr-only">Previous slide (←)</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous slide (←)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleFullscreen}
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <i className={`fi fi-rr-${isFullscreen ? 'compress' : 'expand'} text-lg`}></i>
              <span className="sr-only">{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentSlideIndex === data.slides.length - 1}
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <i className="fi fi-rr-angle-right text-lg"></i>
              <span className="sr-only">Next slide (→ or Space)</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next slide (→ or Space)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}