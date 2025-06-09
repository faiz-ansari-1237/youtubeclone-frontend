import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { useNavigate } from "react-router-dom";

function Subscriptions() {
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [videosPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        const channelsRes = await fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/users/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (channelsRes.status === 401) {
          navigate("/signin");
          return;
        }
        const channelsData = await channelsRes.json();
        setChannels(Array.isArray(channelsData) ? channelsData : []);

        if (channelsData.length === 0) {
          setVideos([]);
          setLoading(false);
          return;
        }

        const channelIds = channelsData.map((ch) => ch._id).join(",");
        const videosRes = await fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/videos/by-channels?ids=${channelIds}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const videosData = await videosRes.json();
        setVideos(Array.isArray(videosData) ? videosData : []);
      } catch (err) {
        setError("Failed to load subscriptions.");
      }
      setLoading(false);
    }
    fetchData();
  }, [navigate]);

  const filteredVideos = Array.isArray(videos)
    ? (selectedChannel
        ? videos.filter((v) => v.owner?._id === selectedChannel)
        : videos)
    : [];

  // Pagination
  const paginatedVideos = filteredVideos.slice((page - 1) * videosPerPage, page * videosPerPage);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
      {/* Channel Avatars Row */}
      <div className="flex space-x-4 overflow-x-auto mb-6">
        <button
          className={`rounded-full px-4 py-2 ${!selectedChannel ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSelectedChannel(null)}
        >
          All
        </button>
        {channels.map((channel) => (
          <button
            key={channel._id}
            className={`flex flex-col items-center focus:outline-none ${selectedChannel === channel._id ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setSelectedChannel(channel._id)}
            title={channel.channelName || channel.username}
          >
            <img
              src={channel.profilePicture || "/default-avatar.png"}
              alt={channel.channelName || channel.username}
              className="w-12 h-12 rounded-full object-cover mb-1"
            />
            <span className="text-xs truncate w-16">{channel.channelName || channel.username}</span>
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : channels.length === 0 ? (
        <div>You are not subscribed to any channels yet.</div>
      ) : filteredVideos.length === 0 ? (
        <div>No videos from your subscriptions yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Subscriptions;
