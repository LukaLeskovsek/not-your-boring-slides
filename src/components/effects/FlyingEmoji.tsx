import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FlyingEmojiProps {
  emoji: string;
  style: React.CSSProperties;
  onAnimationEnd: () => void;
}

export function FlyingEmoji({ emoji, style, onAnimationEnd }: FlyingEmojiProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleAnimationEnd = () => {
      onAnimationEnd();
    };

    element.addEventListener('animationend', handleAnimationEnd);
    return () => element.removeEventListener('animationend', handleAnimationEnd);
  }, [onAnimationEnd]);

  return (
    <div
      ref={ref}
      className={cn(
        'fixed pointer-events-none select-none',
        'animate-fly-up'
      )}
      style={style}
    >
      {emoji}
    </div>
  );
}