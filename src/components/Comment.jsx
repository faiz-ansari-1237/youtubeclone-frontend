// src/components/Comment.jsx
import React, { useState } from 'react';

const getUserId = (userId) =>
  typeof userId === 'object' && userId !== null ? userId._id?.toString() : userId?.toString();

const Comment = ({ comment, onReply, videoOwnerId }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const isOwner = getUserId(comment.userId) === videoOwnerId?.toString();

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <div className="flex items-start mb-4">
      <img
        src={comment.userId?.profilePicture}
        alt={comment.userId?.username}
        className="h-9 w-9 rounded-full object-cover mr-3"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/36x36/AAAAAA/000000?text=CA'; }}
      />
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {comment.userId?.username}
          {isOwner && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Owner</span>
          )}
          <span className="text-xs text-gray-500 font-normal ml-2">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-700">{comment.content}</p>
        <button
          className="text-xs text-blue-600 hover:underline mt-1"
          onClick={() => setShowReply(!showReply)}
        >
          Reply
        </button>
        {showReply && (
          <form onSubmit={handleReplySubmit} className="mt-1 flex items-center space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="flex-1 p-1 border rounded text-xs"
              placeholder="Write a reply..."
            />
            <button type="submit" className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
              Reply
            </button>
          </form>
        )}
        
        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
          <div className="ml-8 mt-2 space-y-2">
            {comment.replies.map(reply => (
              <Comment key={reply._id} comment={reply} onReply={onReply} videoOwnerId={videoOwnerId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
