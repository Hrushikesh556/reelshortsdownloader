import { cn } from '@/utils/cn';

interface AdPlaceholderProps {
  size?: 'banner' | 'rectangle' | 'leaderboard';
  className?: string;
}

export function AdPlaceholder({ size = 'banner', className }: AdPlaceholderProps) {
  const sizeClasses = {
    banner: 'h-16 md:h-20',
    rectangle: 'h-48 md:h-64',
    leaderboard: 'h-24 md:h-28',
  };

  return (
    <div
      className={cn(
        "w-full bg-gradient-to-r from-gray-100 to-gray-50",
        "border-2 border-dashed border-gray-200 rounded-xl",
        "flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <div className="text-center">
        <p className="text-gray-400 text-sm font-medium">Advertisement</p>
        <p className="text-gray-300 text-xs">AdSense Placeholder</p>
      </div>
    </div>
  );
}
