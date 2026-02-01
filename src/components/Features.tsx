export function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Download videos in seconds with our optimized servers',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'We never store your videos or personal data',
    },
    {
      icon: '📱',
      title: 'HD Quality',
      description: 'Get the highest quality MP4 available',
    },
    {
      icon: '🆓',
      title: '100% Free',
      description: 'No hidden fees, no subscription required',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100"
        >
          <div className="text-3xl mb-2">{feature.icon}</div>
          <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
