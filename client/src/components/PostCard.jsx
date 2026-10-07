import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import CommentSection from './CommentSection';
import { HeartIcon, CommentIcon, TrashIcon } from './Icons';

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(date).toLocaleDateString();
};

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [showComments, setShowComments] = useState(false);

  const liked = likes.includes(user._id);
  const isOwner = post.user._id === user._id;

  const toggleLike = async () => {
    const res = await api.put(`/posts/${post._id}/like`);
    setLikes(res.data.likes);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${post._id}`);
    onDelete(post._id);
  };

  return (
    <article className="card post">
      <div className="row space-between">
        <div className="row">
          <Avatar user={post.user} size={44} />
          <div>
            <Link to={`/profile/${post.user.username}`} className="username">
              @{post.user.username}
            </Link>
            <div className="muted small">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        {isOwner && (
          <button className="link-btn danger" title="Delete post" onClick={handleDelete}>
            <TrashIcon />
          </button>
        )}
      </div>

      <p className="post-text">{post.text}</p>

      <div className="row actions">
        <button className={`link-btn ${liked ? 'liked' : ''}`} onClick={toggleLike}>
          <HeartIcon filled={liked} /> {likes.length}
        </button>
        <button className="link-btn" onClick={() => setShowComments((s) => !s)}>
          <CommentIcon /> {commentsCount}
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          postOwnerId={post.user._id}
          onCountChange={(n) => setCommentsCount((c) => c + n)}
        />
      )}
    </article>
  );
}