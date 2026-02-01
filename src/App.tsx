import { useState } from 'react';
import { Downloader } from '@/components/Downloader';
import { VideoPreview } from '@/components/VideoPreview';
import { PlatformBadges } from '@/components/PlatformBadges';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { DemoMode } from '@/components/DemoMode';
import { Header } from '@/components/Header';
import { cn } from '@/utils/cn';

interface DownloadResult {
  file: string;
  title?: string;
}

export function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadStart = () => {
    setIsProcessing(true);
    setError(null);
    setDownloadResult(null);
  };

  const handleDownloadComplete = (data: DownloadResult) => {
    setDownloadResult(data);
    setIsProcessing(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setDownloadResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 font-['Inter',sans-serif]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <Header />
        <PlatformBadges />

        {/* Top Ad */}
        <AdPlaceholder size="leaderboard" className="mb-8" />

        {/* Main Download Card */}
        <main className={cn(
          "bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-200/50",
          "p-6 md:p-10 mb-8",
          "border border-white/50"
        )}>
          {!downloadResult ? (
            <>
              <Downloader
                onDownloadStart={handleDownloadStart}
                onDownloadComplete={handleDownloadComplete}
                onError={handleError}
              />
              <DemoMode 
                onSimulateDownload={(data) => {
                  setDownloadResult(data);
                }}
              />
            </>
          ) : (
            <VideoPreview
              videoUrl={downloadResult.file}
              title={downloadResult.title}
              onReset={handleReset}
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-700 font-medium">Download Failed</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  {error.includes('Backend server') && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-red-100">
                      <p className="text-gray-700 text-sm font-medium">💡 Quick Fix:</p>
                      <ul className="text-gray-600 text-sm mt-2 space-y-1">
                        <li>• Use the <strong>"Try Demo Video"</strong> button below to test the UI</li>
                        <li>• Or deploy the backend server on a VPS (see HOSTING_GUIDE.md)</li>
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-full">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-purple-700 font-medium">Fetching your video...</span>
              </div>
            </div>
          )}
        </main>

        {/* Middle Ad */}
        <AdPlaceholder size="rectangle" className="mb-8" />

        {/* Features */}
        <section className="mb-8">
          <Features />
        </section>

        {/* How It Works */}
        <section className="mb-8">
          <HowItWorks />
        </section>

        {/* Supported Platforms */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Supported Platforms
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
              <div className="text-5xl mb-3">📸</div>
              <h3 className="font-bold text-lg text-gray-800">Instagram Reels</h3>
              <p className="text-sm text-gray-500 mt-2">Download any public Instagram Reel in full HD quality</p>
              <code className="text-xs bg-white px-2 py-1 rounded mt-3 inline-block text-gray-600">
                instagram.com/reel/...
              </code>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="text-5xl mb-3">📘</div>
              <h3 className="font-bold text-lg text-gray-800">Facebook Reels</h3>
              <p className="text-sm text-gray-500 mt-2">Save Facebook Reels directly to your device</p>
              <code className="text-xs bg-white px-2 py-1 rounded mt-3 inline-block text-gray-600">
                facebook.com/.../reel/...
              </code>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl">
              <div className="text-5xl mb-3">🎬</div>
              <h3 className="font-bold text-lg text-gray-800">YouTube Shorts</h3>
              <p className="text-sm text-gray-500 mt-2">Download YouTube Shorts in the best available quality</p>
              <code className="text-xs bg-white px-2 py-1 rounded mt-3 inline-block text-gray-600">
                youtube.com/shorts/...
              </code>
            </div>
          </div>
        </section>

        {/* Bottom Ad */}
        <AdPlaceholder size="leaderboard" className="mb-8" />

        {/* Deployment Guide Section */}
        <section id="how-to-deploy" className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 border border-gray-700 mb-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-2">
            🚀 Deploy Your Own Server
          </h2>
          <p className="text-gray-400 text-center mb-6">Set up the backend to download real videos</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm">1</span>
                Install Dependencies
              </h3>
              <pre className="bg-black/50 p-3 rounded-lg text-sm text-green-400 overflow-x-auto">
{`sudo apt update
sudo apt install ffmpeg python3-pip -y
pip3 install yt-dlp`}
              </pre>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-sm">2</span>
                Run the Server
              </h3>
              <pre className="bg-black/50 p-3 rounded-lg text-sm text-green-400 overflow-x-auto">
{`cd server
npm install
npm start`}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
            <p className="text-blue-200 text-sm">
              <strong>📋 Hosting Options:</strong> Railway.app, Render.com, DigitalOcean, Hetzner, or any VPS. 
              Check <code className="bg-black/30 px-2 py-0.5 rounded">HOSTING_GUIDE.md</code> for detailed instructions.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is this service free?',
                a: 'Yes! Our video downloader is 100% free to use with no hidden fees or subscriptions.',
              },
              {
                q: 'Do I need to create an account?',
                a: 'No account or registration is required. Just paste the URL and download!',
              },
              {
                q: 'Is it legal to download videos?',
                a: 'Downloading videos for personal use is generally acceptable. However, please respect copyright laws and creator rights.',
              },
              {
                q: 'What quality are the downloads?',
                a: 'We always fetch the highest quality available, typically 1080p HD MP4 format.',
              },
            ].map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">❓ {faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
