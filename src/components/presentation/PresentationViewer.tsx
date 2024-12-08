import { usePresentationContext } from '@/hooks/usePresentationContext';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useSlideEffect } from '@/hooks/useSlideEffect';
import { Slide } from './Slide';
import type { ISlide } from '@/types/presentation';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { FlyingEmoji } from '@/components/effects/FlyingEmoji';

export function PresentationViewer() {
  const { data, fontSize, currentSlideIndex } = usePresentationContext();
  useKeyboardNavigation();

  if (!data) return null;

  const { settings } = data;
  const currentSlide = data.slides[currentSlideIndex];
  
  const { flyingEmojis, removeEmoji } = useSlideEffect(currentSlide.effect);

  return (
    <main
      className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        fontSize,
        backgroundImage: `linear-gradient(to bottom right, ${settings.gradientBackground.from}, ${settings.gradientBackground.to})`,
      }}
    >
      <div className="w-[calc(100vh*16/9)] h-[calc(100vh-8rem)] max-w-[calc(100vw-8rem)] max-h-[calc((100vw-8rem)*9/16)] relative">
        <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <Slide key={currentSlideIndex} slide={currentSlide as ISlide} />
          <Footer />
        </div>
        <Navigation />
      </div>
      {flyingEmojis.map(({ id, emoji, style }) => (
        <FlyingEmoji
          key={id}
          emoji={emoji}
          style={style}
          onAnimationEnd={() => removeEmoji(id)}
        />
      ))}
    </main>
  );
}