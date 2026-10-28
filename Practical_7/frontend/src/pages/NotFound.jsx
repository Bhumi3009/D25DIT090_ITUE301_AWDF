import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div className="bento-card span-3">
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', color: '#ef4444' }}>404</h1>
        <h2 className="card-title">Page Not Found</h2>
        <p className="hero-subtitle">The path you requested does not exist on this application.</p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}
