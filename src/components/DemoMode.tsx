import { useState } from 'react';
import { cn } from '@/utils/cn';

interface DemoModeProps {
  onSimulateDownload: (data: { file: string; title: string }) => void;
}

// Sample videos that work reliably
const DEMO_VIDEOS = [
  {
    file: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Sample_Reel_HD.mp4'
  },
  {
    file: 'https://www.w3schools.com/html/movie.mp4',
    title: 'Instagram_Reel_Download.mp4'
  },
  {
    file: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    title: 'YouTube_Shorts_Video.mp4'
  }
];

export function DemoMode({ onSimulateDownload }: DemoModeProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDemo = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Pick a random demo video
      const randomVideo = DEMO_VIDEOS[Math.floor(Math.random() * DEMO_VIDEOS.length)];
      onSimulateDownload(randomVideo);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🎬</span>
        </div>
        <div className="flex-1">
          <p className="text-amber-900 font-bold text-lg">Try Demo Mode</p>
          <p className="text-amber-700 text-sm mt-1 leading-relaxed">
            <strong>Backend server required:</strong> To download real videos, you need to deploy the backend with yt-dlp installed. 
            See the hosting guide for instructions. Click the demo button to test the UI with sample videos.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleDemo}
              disabled={isLoading}
              className={cn(
                "px-5 py-2.5 text-sm font-semibold text-white",
                "bg-gradient-to-r from-amber-500 to-orange-500",
                "hover:from-amber-600 hover:to-orange-600",
                "rounded-xl shadow-md shadow-amber-200",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading Demo...</span>
                </>
              ) : (
                <>
                  <span>▶️</span>
                  <span>Try Demo Video</span>
                </>
              )}
            </button>
            <a
              href="#how-to-deploy"
              className="px-5 py-2.5 text-sm font-semibold text-amber-700 bg-white border-2 border-amber-200 hover:border-amber-300 rounded-xl transition-colors duration-200"
            >
              📖 How to Deploy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
