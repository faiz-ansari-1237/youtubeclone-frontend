import React, { useState, useRef } from 'react';

const VideoUploadModal = ({ isOpen, onClose, onUpload, token, currentUser }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) setVideoFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!videoFile) {
      alert('Please select a video file.');
      setLoading(false);
      return;
    }

    if (!currentUser) {
      alert('You must be signed in to upload.');
      setLoading(false);
      return;
    }

    const getVideoDuration = (file) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.onerror = reject;
        video.src = URL.createObjectURL(file);
      });
    };

    let duration = 0;
    try {
      duration = await getVideoDuration(videoFile);
    } catch (err) {
      alert('Could not read video duration.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('duration', duration);
    formData.append('owner', currentUser._id);
    formData.append('title', title);
    formData.append('description', description);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    // Use XMLHttpRequest for progress
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://youtubeclone-backend-b4m2.onrender.com/api/videos', true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setLoading(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        onUpload && onUpload();
        onClose();
      } else {
        alert('Upload failed. Please try again.');
        console.error('Upload error:', xhr.responseText);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setProgress(0);
      alert('Upload failed. Please try again.');
      console.error('Upload failed:', xhr.statusText);
    };

    xhr.send(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
        <form onSubmit={handleUpload}>
          <div
            className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current.click()}
          >
            {videoFile ? (
              <span className="text-green-600">{videoFile.name}</span>
            ) : (
              <span className="text-gray-500">Drag & drop a video file here, or click to select</span>
            )}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={e => setVideoFile(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Thumbnail (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setThumbnail(e.target.files[0])}
            />
          </div>
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadModal;
