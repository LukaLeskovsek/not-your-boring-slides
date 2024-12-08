import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { SlideEffect } from '@/types/presentation';

interface FlyingEmojiInstance {
  id: string;
  emoji: string;
  style: React.CSSProperties;
}

const MAX_EMOJIS = 15;

export function useSlideEffect(effect: SlideEffect | undefined) {
  const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmojiInstance[]>([]);
  const idCounterRef = useRef(0);
  const previousEffectRef = useRef<SlideEffect | undefined>();

  useEffect(() => {
    // Only trigger if the effect is different from the previous one
    if (!effect || effect === previousEffectRef.current) return;
    previousEffectRef.current = effect;

    switch (effect.type) {
      case 'confetti': {
        const {
          particleCount = 100,
          spread = 70,
          startVelocity = 30,
          colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        } = effect.options || {};

        confetti({
          particleCount,
          spread,
          startVelocity,
          colors,
          origin: { y: 0.6 }
        });
        break;
      }
      case 'flying-emoji': {
        const {
          particleCount = 10,
          emoji = '🚀',
          duration = 3,
          fadeOut = 0.5,
        } = effect.options || {};

        const timestamp = Date.now();
        const count = Math.min(particleCount, MAX_EMOJIS);
        
        // Clear existing emojis before adding new ones
        setFlyingEmojis([]);
        
        const newEmojis: FlyingEmojiInstance[] = Array.from({ length: count }).map((_, index) => {
          const delay = (index * 0.15); // Slightly faster stagger
          const startX = 50 + (Math.random() * (window.innerWidth - 100)); // Keep emojis away from edges
          const rotation = Math.random() * 30 - 15; // Random rotation between -15 and 15 degrees
          const uniqueId = `emoji-${timestamp}-${index}`; // Use index for unique keys
          
          return {
            id: uniqueId,
            emoji,
            style: {
              fontSize: '2rem',
              position: 'fixed',
              bottom: '-50px',
              left: `${startX}px`,
              '--duration': `${duration}s`,
              '--fade-out': `${fadeOut}s`,
              animationDelay: `${delay}s`,
              transform: `rotate(${rotation}deg)`,
              zIndex: 9999,
            } as React.CSSProperties,
          };
        });

        setFlyingEmojis(newEmojis);
        break;
      }
    }
  }, [effect]);

  const removeEmoji = (id: string) => {
    setFlyingEmojis(prev => prev.filter(emoji => emoji.id !== id));
  };

  return {
    flyingEmojis,
    removeEmoji,
  };
}