const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ── Public content endpoint (no auth) ────────────────────────────────────────
app.get('/content.json', (req, res) => {
  const contentPath = path.join(__dirname, 'data/content.json');
  if (!fs.existsSync(contentPath)) {
    return res.json({});
  }
  res.sendFile(contentPath);
});

// ── Auth routes (login page + login POST + logout — no JWT required) ──────────
app.use('/admin', authRoutes);

// ── Dashboard — HTML shell served without auth; JS handles JWT on load ────────
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/dashboard.html'));
});

// ── API routes (all require valid JWT Bearer token) ───────────────────────────
app.use('/api', requireAuth, apiRoutes);

// ── Root redirect ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/admin'));
app.get('/admin', (req, res) => res.redirect('/admin/login'));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  Burlington Cadets CMS v2');
  console.log(`  Admin:    http://localhost:${PORT}/admin`);
  console.log(`  Content:  http://localhost:${PORT}/content.json`);
  console.log(`  Uploads:  http://localhost:${PORT}/uploads/`);
  console.log('');
});
