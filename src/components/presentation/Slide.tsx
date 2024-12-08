import { cn } from '@/lib/utils';
import type { ISlide as SlideType, PieChartData, ProgressBarData, ISlide } from '@/types/presentation';
import { PieChart } from '@/components/charts/PieChart';
import { ProgressBar } from '@/components/charts/ProgressBar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Progress } from "@/components/ui/progress"

interface SlideProps {
  slide: ISlide;
  preview?: boolean;
  className?: string;
}

export function HeaderOnlySlide({ header }: { header: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-5xl font-bold text-gray-900">{header}</h1>
    </div>
  );
}

export function TitleContentSlide({
  header,
  content,
}: {
  header: string;
  content: string;
}) {
  return (
    <div className="flex flex-col gap-8 h-full">
      <h2 className="text-4xl font-semibold text-gray-900">{header}</h2>
      <div className="prose prose-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export function ImageOnlySlide({
  imageUrl,
  altText,
}: {
  imageUrl: string;
  altText: string;
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <img
        src={imageUrl}
        alt={altText}
        className="max-h-full max-w-full object-contain rounded-lg"
      />
    </div>
  );
}

export function GifOnlySlide({
  gifUrl,
  altText,
}: {
  gifUrl: string;
  altText: string;
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <img
        src={gifUrl}
        alt={altText}
        className="max-h-full max-w-full object-contain rounded-lg"
      />
    </div>
  );
}

export function ImageHeaderSlide({
  header,
  imageUrl,
  altText,
}: {
  header: string;
  imageUrl: string;
  altText: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">{header}</h2>
      <div className="flex-1 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={altText}
          className="max-h-full max-w-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
}

export function GifHeaderSlide({
  header,
  gifUrl,
  altText,
}: {
  header: string;
  gifUrl: string;
  altText: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">{header}</h2>
      <div className="flex-1 flex items-center justify-center">
        <img
          src={gifUrl}
          alt={altText}
          className="max-h-full max-w-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
}

export function PieChartSlide({
  header,
  chartData,
}: {
  header: string;
  chartData: PieChartData[];
}) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">{header}</h2>
      <div className="flex-1 flex items-center justify-center">
        <PieChart data={chartData} />
      </div>
    </div>
  );
}

export function ProgressGridSlide({
  header,
  progressData,
  columns = 3,
}: {
  header: string;
  progressData: ProgressBarData[];
  columns?: number;
}) {
  const getColorClasses = (color: string | undefined) => {
    if (!color) {
      return {
        background: 'bg-gray-100',
        indicator: 'bg-gray-500'
      };
    }

    // Handle full Tailwind classes
    if (color.startsWith('bg-')) {
      const baseColor = color.split('-').slice(0, -1).join('-'); // Get the color without the shade
      const shade = color.split('-').pop(); // Get the shade number
      
      return {
        background: `${baseColor}-${shade}/20`, // 20% opacity version
        indicator: color
      };
    }

    // Fallback
    return {
      background: 'bg-gray-100',
      indicator: 'bg-gray-500'
    };
  };

  const getSizeClass = (size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-3';
      case 'md':
        return 'h-2';
      case 'xl':
        return 'h-4';
      case '2xl':
        return 'h-5';
      default:
        return 'h-2';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">{header}</h2>
      <div className={cn(
        'flex-1 grid gap-8',
        {
          'grid-cols-1': columns === 1,
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
        }
      )}>
        {progressData.map((item, index) => {
          const colorClasses = getColorClasses(item.color);
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
              <Progress 
                value={item.value} 
                className={cn("w-full", getSizeClass(item.size), colorClasses.background)}
                indicatorClassName={colorClasses.indicator}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MarkdownSlide({ markdown }: { markdown: string }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export function Slide({ slide, className }: SlideProps) {
  const slideContent = () => {
    switch (slide.type) {
      case 'header-only':
        return <HeaderOnlySlide header={slide.header!} />;
      case 'title-content':
        return (
          <TitleContentSlide header={slide.header!} content={slide.content!} />
        );
      case 'image-only':
        return (
          <ImageOnlySlide imageUrl={slide.imageUrl!} altText={slide.altText!} />
        );
      case 'gif-only':
        return <GifOnlySlide gifUrl={slide.gifUrl!} altText={slide.altText!} />;
      case 'image-header':
        return (
          <ImageHeaderSlide
            header={slide.header!}
            imageUrl={slide.imageUrl!}
            altText={slide.altText!}
          />
        );
      case 'gif-header':
        return (
          <GifHeaderSlide
            header={slide.header!}
            gifUrl={slide.gifUrl!}
            altText={slide.altText!}
          />
        );
      case 'pie-chart':
        return (
          <PieChartSlide
            header={slide.header!}
            chartData={slide.chartData!}
          />
        );
      case 'progress-grid':
        return (
          <ProgressGridSlide
            header={slide.header!}
            progressData={slide.progressData!}
            columns={slide.columns}
          />
        );
      case 'markdown':
        return <MarkdownSlide markdown={slide.markdown!} />;
      default:
        return <div>Unknown slide type</div>;
    }
  };

  return (
    <div className={cn('w-full h-full p-12 slide-transition', className)}>
      {slideContent()}
    </div>
  );
}