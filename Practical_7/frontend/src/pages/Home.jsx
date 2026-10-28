import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="page home-page">
      <div className="bento-card span-3 hero-card">
        <span className="badge-pill">ITUE301 Advanced Web Development</span>
        <h1 className="hero-title">
          JWT Authentication &amp; Middleware Pipeline
        </h1>
        <p className="hero-subtitle">
          Practical 7 implementation featuring bcrypt password hashing, JWT token signing,
          custom authorization middleware, and server-side request validation.
        </p>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/tasks" className="btn btn-primary">
              Go to Your Tasks →
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login with Account
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register New User
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="bento-card">
          <div className="feature-icon">🔒</div>
          <h3 className="card-title">Bcrypt Hashing</h3>
          <p className="feature-desc">
            Passwords are automatically salted and hashed using <code>bcryptjs</code> before storage in MongoDB.
          </p>
        </div>

        <div className="bento-card">
          <div className="feature-icon">🛡️</div>
          <h3 className="card-title">JWT Middleware</h3>
          <p className="feature-desc">
            Express middleware intercepts incoming requests and verifies bearer tokens using <code>jsonwebtoken</code>.
          </p>
        </div>

        <div className="bento-card">
          <div className="feature-icon">⚡</div>
          <h3 className="card-title">Input Validation</h3>
          <p className="feature-desc">
            Dedicated pipeline rejects invalid payloads (malformed emails, short passwords) before database operations.
          </p>
        </div>
      </div>
    </div>
  );
}
