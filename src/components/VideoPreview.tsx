import { cn } from '@/utils/cn';

interface VideoPreviewProps {
  videoUrl: string;
  title?: string;
  onReset: () => void;
}

export function VideoPreview({ videoUrl, title, onReset }: VideoPreviewProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = title || 'video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
        <video
          src={videoUrl}
          controls
          autoPlay
          muted
          playsInline
          className="w-full max-h-[400px] object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {title && (
        <p className="text-sm text-gray-600 text-center truncate px-4">
          📁 {title}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className={cn(
            "flex-1 py-4 px-6 text-lg font-semibold text-white",
            "bg-gradient-to-r from-green-500 to-emerald-600",
            "rounded-2xl shadow-lg shadow-green-200",
            "hover:shadow-xl hover:shadow-green-300 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "transition-all duration-200",
            "flex items-center justify-center gap-3"
          )}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save to Device
        </button>

        <button
          onClick={onReset}
          className={cn(
            "sm:w-auto py-4 px-6 text-lg font-semibold text-gray-700",
            "bg-gray-100 hover:bg-gray-200",
            "rounded-2xl",
            "hover:scale-[1.02] active:scale-[0.98]",
            "transition-all duration-200",
            "flex items-center justify-center gap-2"
          )}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Download
        </button>
      </div>
    </div>
  );
}
