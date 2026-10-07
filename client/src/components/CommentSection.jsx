import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import { CloseIcon, SendIcon } from './Icons';

export default function CommentSection({ postId, postOwnerId, onCountChange }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/posts/${postId}/comments`)
      .then((res) => setComments(res.data))
      .finally(() => setLoading(false));
  }, [postId]);

  const add = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await api.post(`/posts/${postId}/comments`, { text });
    setComments((c) => [...c, res.data]);
    onCountChange(1);
    setText('');
  };

  const remove = async (id) => {
    await api.delete(`/posts/${postId}/comments/${id}`);
    setComments((c) => c.filter((x) => x._id !== id));
    onCountChange(-1);
  };

  return (
    <div className="comments">
      {loading && <small className="muted">Loading comments...</small>}
      {!loading && comments.length === 0 && (
        <small className="muted">No comments yet. Be the first!</small>
      )}
      {comments.map((c) => (
        <div key={c._id} className="comment">
          <Avatar user={c.user} size={30} />
          <div className="comment-body">
            <Link to={`/profile/${c.user.username}`} className="username">@{c.user.username}</Link>
            <span>{c.text}</span>
          </div>
          {(c.user._id === user._id || postOwnerId === user._id) && (
            <button className="link-btn danger" title="Delete comment" onClick={() => remove(c._id)}>
              <CloseIcon />
            </button>
          )}
        </div>
      ))}
      <form className="row comment-form" onSubmit={add}>
        <input
          placeholder="Write a comment..."
          value={text}
          maxLength={300}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-small" disabled={!text.trim()}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
}