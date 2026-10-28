import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar({ darkMode, setDarkMode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">
          <span className="brand-badge">P7</span>
          <span className="brand-title">DevTask Manager</span>
        </NavLink>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
          Home
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active' : '')}>
          Tasks {isAuthenticated && <span className="nav-badge">🔒</span>}
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
          Projects
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
          Contact
        </NavLink>
      </div>

      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {isAuthenticated ? (
          <div className="user-profile-menu">
            <span className="user-pill" title={user?.email}>
              👤 {user?.name || user?.email || 'User'}
            </span>
            <button
              className="btn btn-secondary logout-btn"
              onClick={handleLogoutClick}
              title="Logout from session"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <NavLink to="/login" className="btn btn-secondary nav-auth-btn">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-primary nav-auth-btn">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
