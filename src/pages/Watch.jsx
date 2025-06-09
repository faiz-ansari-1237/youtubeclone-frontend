// src/components/WatchPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, Share2, Download } from 'lucide-react';
import Comment from '../components/Comment.jsx';
import SharePopup from '../components/SharePopup';

const token = localStorage.getItem('token');

const WatchPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsPages, setCommentsPages] = useState(1);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(video?.owner?.subscribers?.length || 0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video?.likes?.length || 0);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [viewsCount, setViewsCount] = useState(video?.views || 0);
  const [showShare, setShowShare] = useState(false);
  const COMMENTS_LIMIT = 5; // or 10, as you like

  useEffect(() => {
    setLoading(true);
    // Fetch video details
    fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/videos/${id}`)
      .then(res => res.json())
      .then(data => {
        setVideo(data);
        setLoading(false);

        // Check if current user is subscribed
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        if (
          currentUser &&
          data.owner &&
          Array.isArray(data.owner.subscribers) &&
          data.owner.subscribers.some(
            subId => subId === currentUser._id || subId._id === currentUser._id
          )
        ) {
          setSubscribed(true);
        } else {
          setSubscribed(false);
        }
        setSubscribersCount(data.owner?.subscribers?.length || 0);
      })
      .catch(() => setLoading(false));

    // Fetch comments for this video
    fetchComments(id, 1);

    // Fetch recommended videos (all except current)
    fetch('https://youtubeclone-backend-b4m2.onrender.com/api/videos')
      .then(res => res.json())
      .then(data => setRecommended(data.filter(v => v._id !== id).slice(0, 4)));
  }, [id]);

  useEffect(() => {
    if (video) {
      setLikesCount(Array.isArray(video.likes) ? video.likes.length : 0);
      const currentUser = JSON.parse(localStorage.getItem('user'));
      setLiked(
        Array.isArray(video.likes) && currentUser
          ? video.likes.map(id => id.toString()).includes(currentUser._id)
          : false
      );
    }
  }, [video]);

  useEffect(() => {
    if (id) {
      fetchComments(id, commentsPage);
    }
  }, [id, commentsPage]);

  useEffect(() => {
    setCommentsPage(1);
  }, [id]);

  useEffect(() => {
    if (!video?._id) return;
    const token = localStorage.getItem('token');

    // Increment view count (for logged-in users)
    if (token) {
      fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/videos/${video._id}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.views !== undefined) setViewsCount(data.views);
        })
        .catch(err => console.error('View count error:', err));

      // Add to watch history
      fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/videos/${video._id}/history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  }, [video?._id]);

  const fetchComments = (videoId) => {
    fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/comments/video/${videoId}`)
      .then(res => res.json())
      .then(setComments)
      .catch(() => setComments([]));
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to subscribe.');
      // Optionally: navigate('/login');
      return;
    }

    try {
      const res = await fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/users/${video.owner._id}/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSubscribed(data.subscribed);
      setSubscribersCount(data.subscribersCount);
    } catch (err) {
      console.error('Subscribe error:', err);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to like videos.');
      return;
    }
    try {
      const res = await fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/videos/${video._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <-- Make sure token is set
        },
        // body: JSON.stringify({ ... }) // if needed
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const res = await fetch('https://youtubeclone-backend-b4m2.onrender.com/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ videoId: id, content: newComment }),
      });
      if (res.ok) {
        fetchComments(id); // Refetch nested comments
        setNewComment('');
      }
    } catch (err) {
      alert('Failed to post comment');
    }
    setPosting(false);
  };

  const handleReply = async (parentId, replyText) => {
    const res = await fetch('https://youtubeclone-backend-b4m2.onrender.com/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: replyText,
        videoId: id,
        parentId,
      }),
    });
    if (res.ok) {
      fetchComments(id); // Refetch nested comments
    }
  };

  const mappedComments = comments.map(comment => ({
    author: comment.userId?.username,
    avatar: comment.userId?.profilePicture,
    text: comment.content,
    timestamp: new Date(comment.createdAt).toLocaleString(),
  }));

  function countAllComments(comments) {
    let count = 0;
    for (const comment of comments) {
      count += 1;
      if (Array.isArray(comment.replies) && comment.replies.length > 0) {
        count += countAllComments(comment.replies);
      }
    }
    return count;
  }

  // Download handler: Save video to localStorage for offline viewing
  const handleDownload = (e) => {
    e.preventDefault();
    if (video) {
      let downloaded = JSON.parse(localStorage.getItem('downloads') || '[]');
      // Avoid duplicates
      if (!downloaded.find(v => v._id === video._id)) {
        downloaded.push(video);
        localStorage.setItem('downloads', JSON.stringify(downloaded));
        alert('Video saved for offline viewing!');
      } else {
        alert('Video is already downloaded.');
      }
    } else {
      alert('No downloadable video found.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-500">
        Loading...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Video not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full px-2 sm:px-4  lg:mx-auto lg:px-8 py-4 gap-8">
      {/* Main video player and details section */}
      <div className="flex-1 mb-8 lg:mb-0">
        {/* Video Player */}
        <div className="aspect-ratio w-full bg-black rounded-lg overflow-hidden shadow-md">
          <video
            src={video.videoUrl}
            controls
            className="w-full h-auto object-cover rounded-lg bg-black"
          />
        </div>

        {/* Video Title and Channel Info */}
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{video.title}</h1>
        {/* Channel Info and Subscribe */}
        <div className="flex items-center justify-between mb-4 w-full">
          <Link
            to={`/profile/${video.owner?._id}`}
            className="flex items-center hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img
              src={video.owner?.profilePicture}
              alt={video.owner?.channelName || video.owner?.username}
              className="h-10 w-10 rounded-full object-cover mr-3"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/AAAAAA/000000?text=CI'; }}
            />
            <div>
              <h2 className="font-semibold text-gray-800">{video.owner?.channelName || video.owner?.username}</h2>
              <p className="text-sm text-gray-600">{subscribersCount} Subscribers</p>
            </div>
          </Link>
          <button
            onClick={handleSubscribe}
            className={`px-4 py-2 ${subscribed ? 'bg-gray-400' : 'bg-red-600'} text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors`}
          >
            {subscribed ? 'Unsubscribe' : 'Subscribe'} ({subscribersCount})
          </button>
        </div>
        
        {/* Video Actions: Like, Share, Download */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            className={`flex items-center space-x-2 p-2 rounded-full text-gray-700 text-sm ${liked ? 'bg-blue-100' : 'bg-gray-100'} hover:bg-gray-200`}
            onClick={handleLike}
          >
            <ThumbsUp className={`h-5 w-5 ${liked ? 'text-blue-600' : ''}`} />
            <span>{likesCount}</span>
            {liked && (
              <span className="text-blue-600 font-semibold ml-1">Liked</span>
            )}
          </button>
          <button
            className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700 text-sm"
            onClick={() => setShowShare(true)}
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
          <button
            className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700 text-sm"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        </div>

        {/* Video Description */}
        <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800 mb-6">
          <p className="font-semibold">{video.views ?? 0} views • {new Date(video.createdAt).toLocaleDateString()}</p>
          <p className="mt-2">{video.description}</p>
        </div>

        {/* Comments Section */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Comments ({countAllComments(comments)})
        </h3>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => (
              <Comment
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                videoOwnerId={video.owner?._id}
              />
            ))
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCommentsPage(p => Math.max(1, p - 1))}
            disabled={commentsPage === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {commentsPage} of {commentsPages}
          </span>
          <button
            onClick={() => setCommentsPage(p => Math.min(commentsPages, p + 1))}
            disabled={commentsPage === commentsPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Add Comment Section */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Add a comment</h4>
          <form onSubmit={handleAddComment} className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded"
              disabled={posting}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={posting || !newComment.trim()}
            >
              {posting ? 'Posting...' : 'Comment'}
            </button>
          </form>
        </div>
      </div>

      {/* Recommended Videos Section */}
      <div className="w-full lg:w-80 lg:flex-shrink-0">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended</h3>
        <div className="space-y-4">
          {Array.isArray(recommended) && recommended.length > 0 ? (
            recommended.map(recVideo => (
              <Link to={`/watch/${recVideo._id}`} key={recVideo._id} className="flex items-start space-x-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <img
                  src={recVideo.thumbnailUrl}
                  alt={recVideo.title}
                  className="w-36 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/144x80/CCCCCC/000000?text=Rec+Video'; }}
                />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{recVideo.title}</h4>
                  <p className="text-xs text-gray-600">{recVideo.owner?.channelName || recVideo.owner?.username}</p>
                  <p className="text-xs text-gray-500">{recVideo.views ?? 0}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No recommended videos.</p>
          )}
        </div>
      </div>

      <SharePopup
        open={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={`${window.location.origin}/watch/${video._id}`}
        shareText={video.title}
      />
    </div>
  );
};

export default WatchPage;
