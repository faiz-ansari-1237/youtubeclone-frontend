// src/components/Feed.jsx
import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard.jsx';

const Feed = ({ searchQuery }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos from backend API
    fetch('http://192.168.0.190:5000/api/videos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVideos(data);
        } else {
          setVideos([]);
          console.error('API did not return an array:', data);
        }
        setLoading(false); // <-- Set loading to false here
      })
      .catch(err => {
        setVideos([]);
        setLoading(false); // <-- And here
        console.error('Failed to fetch videos:', err);
      });
  }, []);

  // Filter videos based on searchQuery
  const filteredVideos = videos.filter(video =>
    (video.title || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {loading ? (
        <p className="text-lg text-gray-600 text-center">Loading videos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-visible">
          {filteredVideos.length > 0 ? (
            filteredVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <p className="text-lg text-gray-600 col-span-full text-center">No videos found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
