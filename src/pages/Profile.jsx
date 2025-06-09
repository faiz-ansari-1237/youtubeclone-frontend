// src/components/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const profileId = id || currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description);
  };

  useEffect(() => {
    fetch(`http://192.168.0.190:5000/api/users/${profileId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profileId]);

  useEffect(() => {
    if (profileId) {
      fetch(`http://192.168.0.190:5000/api/videos?userId=${profileId}`)
        .then(res => res.json())
        .then(data => {
          setUserVideos(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [profileId]);

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://192.168.0.190:5000/api/videos/${videoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUserVideos(userVideos.filter(v => v._id !== videoId));
      alert('Video deleted!');
    } else {
      alert('Failed to delete video.');
    }
  };

  if (!profileId) {
    // Optionally, redirect to home or login
    return <Navigate to="/" />;
  }

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <img
            src={profile.profilePicture}
            alt={profile.username}
            className="h-24 w-24 rounded-full object-cover mr-6 border-4 border-blue-400"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.channelName || profile.username}</h1>
            <p className="text-lg text-gray-600">
              @{(profile.username ?? profile.name ?? '').toLowerCase().replace(' ', '')}
            </p>
            <p className="text-md text-gray-700 mt-2">
              {profile?.subscribers?.length || 0} Subscribers
            </p>
          </div>
        </div>

        {currentUser && currentUser._id === profile._id && (
          <Link
            to="/settings"
            className="inline-block px-4 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </Link>
        )}

        <hr className="my-6 border-gray-200" />

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
        <p className="text-gray-700 mb-6">
          Welcome to {profile.channelName}'s channel! Here you'll find videos about web development tutorials, daily vlogs, and tech reviews.
          I aim to create engaging and informative content to help you on your coding journey.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Videos</h2>
        {loading ? (
          <p className="text-lg text-gray-600">Loading your videos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userVideos.length > 0 ? (
              userVideos.map(video => (
                <div key={video._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.views} views • {video.createdAt && new Date(video.createdAt).toLocaleDateString()}</p>
                  <Link to={`/watch/${video._id}`} className="text-blue-600 hover:underline text-sm mt-2 block">Watch Video</Link>
                  {currentUser && currentUser._id === profile._id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-600 col-span-full text-center">You haven't uploaded any videos yet.</p>
            )}
          </div>
        )}

        {editingVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Video</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem('token');
                  const res = await fetch(`http://192.168.0.190:5000/api/videos/${editingVideo._id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      title: editTitle,
                      description: editDescription,
                    }),
                  });
                  if (res.ok) {
                    const updated = await res.json();
                    setUserVideos(userVideos.map(v => v._id === updated._id ? updated : v));
                    setEditingVideo(null);
                    alert('Video updated!');
                  } else {
                    alert('Failed to update video.');
                  }
                }}
              >
                <label className="block mb-2 font-semibold">Title</label>
                <input
                  className="w-full border rounded p-2 mb-4"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <label className="block mb-2 font-semibold">Description</label>
                <textarea
                  className="w-full border rounded p-2 mb-4"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditingVideo(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ProfilePage;
