const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '../data/users.json');

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return { users: [] };
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// GET /admin/login
router.get('/login', (req, res) => {
  if (req.session && req.session.isLoggedIn) {
    return res.redirect('/admin/dashboard');
  }
  res.sendFile(path.join(__dirname, '../admin/login.html'));
});

// POST /admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  const data = loadUsers();
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(401).sendFile(path.join(__dirname, '../admin/login.html'));
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).sendFile(path.join(__dirname, '../admin/login.html'));
  }

  req.session.isLoggedIn = true;
  req.session.username = user.username;

  const returnTo = req.session.returnTo || '/admin/dashboard';
  delete req.session.returnTo;
  res.redirect(returnTo);
});

// GET /admin/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;
