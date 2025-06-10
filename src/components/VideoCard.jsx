// src/components/VideoCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MoreVertical, Clock, Share2, Download } from 'lucide-react';
import SharePopup from './SharePopup'; // Import the SharePopup

const VideoCard = ({ video }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Download handler (assumes video.videoUrl exists)
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Save video to localStorage
    let downloaded = JSON.parse(localStorage.getItem('downloads') || '[]');
    // Avoid duplicates
    if (!downloaded.find(v => v._id === video._id)) {
      downloaded.push(video);
      localStorage.setItem('downloads', JSON.stringify(downloaded));
    }
    setMenuOpen(false);
    // Optionally show a toast/alert: "Video saved for offline viewing"
  };

  return (
    <div className="relative">
      <Link to={`/watch/${video._id}`} className="block w-full rounded-lg transition-transform transform hover:scale-105">
        <div className="w-full h-40 overflow-hidden rounded-md mb-2">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/480x270/CCCCCC/000000?text=Video+Thumbnail'; }}
          />
        </div>
        <div className="flex mt-3 p-1">
          <img
            src={video.owner?.profilePicture}
            alt={video.owner?.channelName || video.owner?.username}
            className="h-9 w-9 rounded-full object-cover mr-3"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/36x36/AAAAAA/000000?text=CI'; }}
          />
          <div className="flex-1">
            {/* Title and 3-dot menu in the same row */}
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900 line-clamp-2">{video.title}</h4>
              <div className="relative" ref={menuRef}>
                <button
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                >
                  <MoreVertical className='w-5 h-5'/>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 bg-white shadow-lg rounded z-[999] min-w-[180px]">
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/users/me/watch-later/${video._id}`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        setMenuOpen(false);
                      }}
                    >
                      <Clock className="w-4 h-4" />
                      Save to Watch Later
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowShare(true);
                        setMenuOpen(false);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Channel name below */}
            <p className="text-sm text-gray-600">{video.owner?.channelName || video.owner?.username}</p>
            {/* Views and date below */}
            <p className="text-xs text-gray-500">{video.views ?? 0} views • {new Date(video.createdAt).toLocaleDateString()}</p>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{Array.isArray(video.likes) ? video.likes.length : 0} Likes</span>
            </div>
          </div>
        </div>
      </Link>
      {/* Share Popup */}
      <SharePopup
        open={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={`${window.location.origin}/watch/${video._id}`}
        shareText={video.title}
      />
    </div>
  );
};

export default VideoCard;
