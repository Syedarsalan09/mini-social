import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
import { SparkIcon } from '../components/Icons';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <div className="auth-logo"><SparkIcon size={26} /></div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Log in to see what your friends are up to.</p>
        {error && <p className="error">{error}</p>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
        <button className="btn btn-block">Login</button>
        <p className="auth-foot muted">No account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}