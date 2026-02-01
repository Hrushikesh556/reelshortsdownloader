export function Header() {
  return (
    <header className="text-center mb-8 md:mb-12">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6 animate-fade-in">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-sm font-medium text-gray-600">100% Free • No Login Required</span>
      </div>
      
      {/* Main Title */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight animate-slide-up">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
          Download Reels & Shorts
        </span>
        <br />
        <span className="text-2xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
          in HD Quality
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        The fastest way to download Instagram Reels, Facebook Reels, and YouTube Shorts. 
        No watermarks, no limits.
      </p>
    </header>
  );
}
