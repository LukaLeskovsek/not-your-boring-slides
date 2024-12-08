import { cn } from '@/lib/utils';

interface ProgressBarProps {
  label: string;
  value: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ProgressBar({ 
  label, 
  value, 
  color = 'bg-blue-500', 
  size = 'md',
  className 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
    xl: 'h-8',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex justify-between items-center">
        <span className={cn('font-medium text-gray-700', labelSizeClasses[size])}>{label}</span>
        <span className={cn('font-medium text-gray-900', labelSizeClasses[size])}>{value}%</span>
      </div>
      <div className={cn('bg-gray-100 rounded-full overflow-hidden', sizeClasses[size])}>
        <div 
          className={cn('h-full transition-all duration-500 ease-out rounded-full', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}