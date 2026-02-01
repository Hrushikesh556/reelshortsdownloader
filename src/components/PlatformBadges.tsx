export function PlatformBadges() {
  const platforms = [
    { name: 'Instagram Reels', icon: '📸', color: 'from-pink-500 to-purple-600' },
    { name: 'Facebook Reels', icon: '📘', color: 'from-blue-500 to-blue-700' },
    { name: 'YouTube Shorts', icon: '🎬', color: 'from-red-500 to-red-700' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {platforms.map((platform) => (
        <div
          key={platform.name}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100"
        >
          <span className="text-xl">{platform.icon}</span>
          <span className="text-sm font-medium text-gray-700">{platform.name}</span>
        </div>
      ))}
    </div>
  );
}
