import { useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function CreatePost({ onCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/posts', { text });
      onCreated(res.data);
      setText('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card create-post" onSubmit={submit}>
      <div className="row top">
        <Avatar user={user} size={44} />
        <textarea
          placeholder={`What's on your mind, ${user?.username}?`}
          value={text}
          maxLength={500}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="row space-between footer-row">
        <small className="muted">{text.length}/500</small>
        <button className="btn" disabled={busy || !text.trim()}>
          {busy ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}