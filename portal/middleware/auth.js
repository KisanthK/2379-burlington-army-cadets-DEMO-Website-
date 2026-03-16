function requireAuth(req, res, next) {
  if (req.session && req.session.isLoggedIn === true) {
    return next();
  }
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ success: false, error: 'Not authenticated. Please log in.' });
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect('/admin/login');
}

module.exports = { requireAuth };
