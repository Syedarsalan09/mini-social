import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, UserIcon, LogoutIcon, SunIcon, MoonIcon, SparkIcon } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-logo"><SparkIcon size={18} /></span>
          <span className="brand-text">MiniSocial</span>
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <NavLink to="/" end className="nav-link">
                <HomeIcon size={18} /><span className="nav-label">Home</span>
              </NavLink>
              <NavLink to={`/profile/${user.username}`} className="nav-link">
                <UserIcon size={18} /><span className="nav-label">Profile</span>
              </NavLink>
              <button className="icon-btn" title="Logout" onClick={handleLogout}>
                <LogoutIcon size={18} />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/register" className="nav-link">Register</NavLink>
            </>
          )}
          <button
            className="icon-btn"
            title="Toggle theme"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}