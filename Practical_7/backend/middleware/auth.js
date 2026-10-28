const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Validates the JWT provided in the Authorization header: Bearer <token>
 * Attaches the decoded payload to req.user
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Access denied. No token provided or malformed header. Expected: Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access denied. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id: user._id, email: user.email, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      error: 'Invalid token. Authorization failed.'
    });
  }
};

module.exports = authMiddleware;
