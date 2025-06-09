import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';

const History = () => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('https://youtubeclone-backend-b4m2.onrender.com/api/users/me/history', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setHistory);
  }, []);
  
  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Watch History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {history.map(entry => (
          entry.video ? (
            <div key={entry._id || entry.video._id}>
              <VideoCard video={entry.video} />
              <div className="text-xs text-gray-500 mt-1">
                Watched on {new Date(entry.watchedAt).toLocaleString()}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default History;
