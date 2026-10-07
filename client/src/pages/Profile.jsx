import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import { SparkIcon } from '../components/Icons';

export default function Profile() {
  const { username } = useParams();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', avatar: '' });

  const loadProfile = async () => {
    const res = await api.get(`/users/${username}`);
    setProfile(res.data);
    return res.data;
  };

  useEffect(() => {
    setError('');
    setProfile(null);
    setEditing(false);
    Promise.all([loadProfile(), api.get(`/posts/user/${username}`)])
      .then(([p, postsRes]) => {
        setForm({ bio: p.bio, avatar: p.avatar });
        setPosts(postsRes.data);
      })
      .catch((err) => setError(errMsg(err)));
    // eslint-disable-next-line
  }, [username]);

  if (error) return <p className="center-text error">{error}</p>;
  if (!profile)
    return (
      <div className="center-text muted">
        <div className="spinner" />
        Loading profile...
      </div>
    );

  const isMe = profile._id === user._id;
  const isFollowing = profile.followers.includes(user._id);

  const toggleFollow = async () => {
    await api.put(`/users/${profile._id}/follow`);
    loadProfile();
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await api.put('/users/me', form);
    setUser({ ...user, bio: res.data.bio, avatar: res.data.avatar });
    setEditing(false);
    loadProfile();
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="card profile-card">
        <div className="profile-cover" />
        <div className="profile-body">
          <div className="profile-avatar-wrap">
            <Avatar user={profile} size={96} />
          </div>

          <div className="profile-top">
            <h2>@{profile.username}</h2>
            {isMe ? (
              <button className="btn btn-outline" onClick={() => setEditing((e) => !e)}>
                {editing ? 'Cancel' : 'Edit profile'}
              </button>
            ) : (
              <button className={`btn ${isFollowing ? 'btn-outline' : ''}`} onClick={toggleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <p className="profile-bio">{profile.bio || <span className="muted">No bio yet.</span>}</p>

          <div className="stats">
            <div className="stat"><b>{profile.postsCount}</b>Posts</div>
            <div className="stat"><b>{profile.followers.length}</b>Followers</div>
            <div className="stat"><b>{profile.following.length}</b>Following</div>
          </div>
        </div>
      </div>

      {editing && (
        <form className="card" onSubmit={saveProfile}>
          <h3 style={{ marginBottom: 12 }}>Edit profile</h3>
          <input
            placeholder="Avatar image URL (optional)"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />
          <textarea
            placeholder="Your bio (max 160 chars)"
            maxLength={160}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <button className="btn">Save changes</button>
        </form>
      )}

      <h3 className="section-title">Posts</h3>
      {posts.length === 0 && (
        <div className="empty">
          <div className="empty-icon"><SparkIcon size={34} /></div>
          <b>No posts yet</b>
        </div>
      )}
      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={p}
          onDelete={(id) => {
            setPosts((prev) => prev.filter((x) => x._id !== id));
            setProfile((pr) => ({ ...pr, postsCount: pr.postsCount - 1 }));
          }}
        />
      ))}
    </div>
  );
}