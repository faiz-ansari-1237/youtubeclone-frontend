import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';

const Downloads = () => {
    const [videos, setVideos] = useState([]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        // Fetch downloaded videos from localStorage
        const stored = localStorage.getItem('downloads');
        setVideos(stored ? JSON.parse(stored) : []);
    }, []);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!videos.length) {
        return (
            <div className="flex-1 p-6 bg-gray-50">
                <div className="p-8 text-center text-gray-500">
                    No downloads found.
                </div>
            </div>

        );
    }

    return (
        <div className="flex-1 p-6 bg-gray-50">
            {isOffline && (
                <div className="bg-yellow-100 text-yellow-800 p-2 mb-4 rounded text-center">
                    You are offline. Showing downloaded videos.
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-visible">
                {videos.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default Downloads;