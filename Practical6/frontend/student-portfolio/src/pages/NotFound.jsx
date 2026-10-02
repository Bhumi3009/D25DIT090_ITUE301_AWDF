import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page not-found-page">
      <h1>404</h1>
      <p className="card-text">Oops — this page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  )
}

export default NotFound