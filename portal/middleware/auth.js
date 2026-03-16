const jwt = require('jsonwebtoken');

// Same secret as routes/auth.js — read from env or fall back to default
const JWT_SECRET = process.env.JWT_SECRET || 'burlington-cadets-jwt-secret-2379';

/**
 * requireAuth — JWT Bearer token middleware
 *
 * Extracts the token from the Authorization header:
 *   Authorization: Bearer <token>
 *
 * On success: attaches decoded payload to req.user and calls next()
 * On failure: returns 401 JSON { success: false, error: '...' }
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated. Authorization header with Bearer token is required.'
    });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.'
    });
  }
}

module.exports = { requireAuth };
