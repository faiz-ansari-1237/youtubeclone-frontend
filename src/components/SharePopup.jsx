import React from 'react';
import { X, Copy } from 'lucide-react';

const socialLinks = (shareUrl, shareText) => [
  {
    name: 'WhatsApp',
    url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    icon: (
      <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: '#25D366' }}>
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
      </span>
    ),
  },
  {
    name: 'Instagram',
    url: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`,
    icon: (
      <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
      </span>
    ),
  },
  {
    name: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    icon: (
      <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: '#1877F3' }}>
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
      </span>
    ),
  },
  {
    name: 'Twitter',
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`,
    icon: (
      <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: '#1DA1F2' }}>
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" alt="Twitter" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
      </span>
    ),
  },
  {
    name: 'Telegram',
    url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`,
    icon: (
      <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: '#229ED9' }}>
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg" alt="Telegram" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
      </span>
    ),
  },
];

const SharePopup = ({ open, onClose, shareUrl, shareText }) => {
  if (!open) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold mb-4">Share</h3>
        <div className="flex gap-4 mb-4">
          {socialLinks(shareUrl, shareText).map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:bg-gray-100 rounded p-2"
              title={link.name}
            >
              {link.icon}
              <span className="text-xs mt-1">{link.name}</span>
            </a>
          ))}
        </div>
        <div className="flex items-center bg-gray-100 rounded px-3 py-2">
          <span className="flex-1 text-xs truncate">{shareUrl}</span>
          <button
            className="ml-2 p-1 rounded hover:bg-gray-200"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;