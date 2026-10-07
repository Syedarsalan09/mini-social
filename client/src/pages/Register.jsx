import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
import { SparkIcon } from '../components/Icons';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <div className="auth-logo"><SparkIcon size={26} /></div>
        <h2>Join MiniSocial</h2>
        <p className="auth-sub">Create your account and start sharing.</p>
        {error && <p className="error">{error}</p>}
        <input name="username" placeholder="Username (3-20 chars)" value={form.username} onChange={change} minLength={3} maxLength={20} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={change} minLength={6} required />
        <button className="btn btn-block">Create account</button>
        <p className="auth-foot muted">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}