import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Rule 1: All fields required
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required');
      return;
    }

    // Rule 2: Password min length 6
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Rule 3: Password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="bento-card span-3 auth-card">
        <div className="auth-header">
          <span className="auth-icon">📝</span>
          <h2 className="card-title">Create Account</h2>
          <p className="auth-subtitle">Register to manage your tasks with JWT authentication</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="contact-form auth-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bhumi Patel"
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., bhumi@charusat.edu.in"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password (min 6 characters)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
