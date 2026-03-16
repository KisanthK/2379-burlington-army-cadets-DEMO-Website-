const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const USERS_FILE = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'burlington-cadets-jwt-secret-2379';
const JWT_EXPIRES_IN = '8h';

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const raw = fs.readFileSync(USERS_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  // Support both flat array [] and legacy { users: [] } formats
  return Array.isArray(parsed) ? parsed : (parsed.users || []);
}

// GET /admin/login — serve login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/login.html'));
});

// POST /admin/login — verify credentials, return JWT
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid username or password.' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ success: false, error: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    { username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({ success: true, token, username: user.username });
});

// GET /admin/logout — client-side logout (just clears token), nothing to do server-side
router.get('/logout', (req, res) => {
  res.redirect('/admin/login');
});

module.exports = router;
module.exports.JWT_SECRET = JWT_SECRET;
