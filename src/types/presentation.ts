export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

export interface ProgressBarData {
  label: string;
  value: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export type SlideType = 
  | 'header-only'
  | 'title-content'
  | 'image-only'
  | 'gif-only'
  | 'image-header'
  | 'gif-header'
  | 'pie-chart'
  | 'progress-grid'
  | 'markdown';

export type EffectType = 'flying-emoji' | 'confetti';

export interface SlideEffect {
  type: EffectType;
  options: {
    particleCount?: number;
    emoji?: string;
    duration?: number;
    fadeOut?: number;
    spread?: number;
  };
}

export interface ISlide {
  type: 'header-only' | 'title-content' | 'image-only' | 'gif-only' | 'image-header' | 'gif-header' | 'pie-chart' | 'progress-grid' | 'markdown';
  header?: string;
  content?: string;
  imageUrl?: string;
  gifUrl?: string;
  altText?: string;
  effect?: SlideEffect;
  chartData?: PieChartData[];
  progressData?: ProgressBarData[];
  columns?: number;
  markdown?: string;
}

export interface PresentationSettings {
  fontSize: string;
  fontFamily: string;
  gradientBackground: {
    from: string;
    to: string;
  };
  footer: {
    logoUrl: string;
    dateFormat: string;
  };
  date: string;
}

export type PresentationData = {
  documentName: string;
  settings: {
    fontSize: string;
    fontFamily: string;
    gradientBackground: {
      from: string;
      to: string;
    };
    footer: {
      logoUrl: string;
      dateFormat: string;
    };
    date: string;
  };
  slides: Array<{
    type: string;
    header?: string;
    effect?: SlideEffect;
    [key: string]: any;
  }>;
};