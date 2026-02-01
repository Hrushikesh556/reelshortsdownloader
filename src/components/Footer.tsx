export function Footer() {
  return (
    <footer className="mt-12 pb-8 text-center space-y-4">
      <div className="flex justify-center gap-6 text-gray-400">
        <a href="#" className="hover:text-gray-600 transition-colors text-sm">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600 transition-colors text-sm">Terms of Service</a>
        <a href="#" className="hover:text-gray-600 transition-colors text-sm">Contact</a>
      </div>
      
      <div className="max-w-xl mx-auto px-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> For personal use only. We do not store videos. 
          Users are responsible for respecting copyright and intellectual property rights. 
          This service is not affiliated with Instagram, Facebook, or YouTube.
        </p>
      </div>

      <p className="text-gray-300 text-xs">
        © {new Date().getFullYear()} Video Downloader. All rights reserved.
      </p>
    </footer>
  );
}
