import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';

const WatchLater = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://192.168.0.190:5000/api/users/me/watch-later', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setVideos);
  }, []);
  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Watch Later</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default WatchLater;