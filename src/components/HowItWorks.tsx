export function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Copy the URL',
      description: 'Find the reel or short you want to download and copy its URL',
      icon: '📋',
    },
    {
      step: '2',
      title: 'Paste & Download',
      description: 'Paste the URL in the input box above and click download',
      icon: '📥',
    },
    {
      step: '3',
      title: 'Save to Device',
      description: 'Preview the video and save it to your device in HD quality',
      icon: '💾',
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((item, index) => (
          <div key={item.step} className="text-center relative">
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-300 to-transparent" />
            )}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl mb-4 shadow-lg">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
