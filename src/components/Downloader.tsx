import { useState } from 'react';
import { cn } from '@/utils/cn';

interface DownloadResponse {
  file: string;
  title?: string;
  error?: string;
}

interface DownloaderProps {
  onDownloadStart: () => void;
  onDownloadComplete: (data: DownloadResponse) => void;
  onError: (error: string) => void;
}

export function Downloader({ onDownloadStart, onDownloadComplete, onError }: DownloaderProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (inputUrl: string): boolean => {
    const patterns = [
      /instagram\.com\/(reel|p)\//i,
      /facebook\.com.*\/reel/i,
      /fb\.watch/i,
      /youtube\.com\/shorts\//i,
      /youtu\.be\//i,
    ];
    return patterns.some(pattern => pattern.test(inputUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      onError('Please enter a video URL');
      return;
    }

    if (!validateUrl(url)) {
      onError('Please enter a valid Instagram Reel, Facebook Reel, or YouTube Shorts URL');
      return;
    }

    setIsLoading(true);
    onDownloadStart();

    try {
      // API endpoint - configure based on your backend deployment
      // For production, change this to your actual server URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/download';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to download video');
      }

      onDownloadComplete(data);
      setUrl('');
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          onError('Request timed out. Please try again.');
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          onError('Backend server is not running. Please use the "Try Demo" button below to test the UI, or deploy the backend server following the instructions in HOSTING_GUIDE.md');
        } else {
          onError(err.message);
        }
      } else {
        onError('An error occurred while downloading');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = () => {
    if (url.includes('instagram')) return '📸';
    if (url.includes('facebook') || url.includes('fb.')) return '📘';
    if (url.includes('youtube') || url.includes('youtu.be')) return '🎬';
    return '🎥';
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
          {getPlatformIcon()}
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Instagram, Facebook, or YouTube Shorts URL here..."
          className={cn(
            "w-full pl-14 pr-4 py-4 text-base md:text-lg",
            "bg-white border-2 border-gray-200 rounded-2xl",
            "focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100",
            "placeholder:text-gray-400 text-gray-800",
            "transition-all duration-200",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-4 px-6 text-lg font-semibold text-white",
          "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500",
          "rounded-2xl shadow-lg shadow-purple-200",
          "hover:shadow-xl hover:shadow-purple-300 hover:scale-[1.02]",
          "active:scale-[0.98]",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          "flex items-center justify-center gap-3"
        )}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Processing Video...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Video in HD</span>
          </>
        )}
      </button>
    </form>
  );
}
