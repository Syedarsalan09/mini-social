import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';
import { SparkIcon } from '../components/Icons';

export default function Home() {
  const [tab, setTab] = useState('feed'); // 'feed' | 'explore'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setLoading(true);
    api
      .get(tab === 'feed' ? '/posts/feed' : '/posts/explore')
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => {
    api.get('/users/suggestions').then((res) => setSuggestions(res.data));
  }, []);

  const follow = async (id) => {
    await api.put(`/users/${id}/follow`);
    setSuggestions((s) => s.filter((u) => u._id !== id));
    if (tab === 'feed') {
      const res = await api.get('/posts/feed');
      setPosts(res.data);
    }
  };

  return (
    <div className="layout">
      <section className="main-col">
        <CreatePost onCreated={(p) => setPosts((prev) => [p, ...prev])} />

        <div className="tabs">
          <button className={tab === 'feed' ? 'active' : ''} onClick={() => setTab('feed')}>Following</button>
          <button className={tab === 'explore' ? 'active' : ''} onClick={() => setTab('explore')}>Explore</button>
        </div>

        {loading && (
          <div className="center-text muted">
            <div className="spinner" />
            Loading posts...
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="empty">
            <div className="empty-icon"><SparkIcon size={34} /></div>
            <b>Nothing here yet</b>
            <p>Follow people or check the Explore tab!</p>
          </div>
        )}

        {!loading &&
          posts.map((p) => (
            <PostCard
              key={p._id}
              post={p}
              onDelete={(id) => setPosts((prev) => prev.filter((x) => x._id !== id))}
            />
          ))}
      </section>

      <aside className="side-col">
        <div className="card">
          <h3>Who to follow</h3>
          {suggestions.length === 0 && <small className="muted">No suggestions right now.</small>}
          {suggestions.map((u) => (
            <div key={u._id} className="row space-between suggestion">
              <Link to={`/profile/${u.username}`} className="row">
                <Avatar user={u} size={36} />
                <span className="username">@{u.username}</span>
              </Link>
              <button className="btn btn-small" onClick={() => follow(u._id)}>Follow</button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}