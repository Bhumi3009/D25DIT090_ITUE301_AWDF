import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, authNotification, clearAuthNotification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/tasks';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    clearAuthNotification();

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="bento-card span-3 auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔐</span>
          <h2 className="card-title">User Authentication</h2>
          <p className="auth-subtitle">Sign in to access your protected tasks</p>
        </div>

        {authNotification && (
          <div className="alert alert-warning">
            <span>ℹ️ {authNotification}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="contact-form auth-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., student@charusat.edu.in"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <div className="task-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
