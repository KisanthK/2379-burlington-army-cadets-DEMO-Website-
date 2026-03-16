const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/content.json');
const BACKUP_DIR = path.join(__dirname, '../data/backups');
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// ── Multer (memory storage — sharp processes before saving) ──────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed.'));
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function readContent() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeContent(data) {
  // Create timestamped backup first
  if (fs.existsSync(DATA_FILE)) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(DATA_FILE, path.join(BACKUP_DIR, `content-${ts}.json`));
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── GET /api/content ──────────────────────────────────────────────────────────
router.get('/content', (req, res) => {
  res.json(readContent());
});

// ── POST /api/content/:section ────────────────────────────────────────────────
router.post('/content/:section', (req, res) => {
  try {
    const content = readContent();
    content[req.params.section] = { ...content[req.params.section], ...req.body };
    writeContent(content);
    res.json({ success: true, section: req.params.section });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/images ───────────────────────────────────────────────────────────
router.get('/images', (req, res) => {
  if (!fs.existsSync(UPLOADS_DIR)) return res.json({ images: [] });
  const files = fs.readdirSync(UPLOADS_DIR)
    .filter(f => /\.(webp|jpg|jpeg|png|gif)$/i.test(f))
    .map(f => ({ filename: f, url: `/uploads/${f}` }));
  res.json({ images: files });
});

// ── POST /api/images/upload ───────────────────────────────────────────────────
router.post('/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded.' });

    const ts = Date.now();
    const filename = `${ts}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    await sharp(req.file.buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    res.json({ success: true, filename, url: `/uploads/${filename}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/images/:filename ──────────────────────────────────────────────
router.delete('/images/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, path.basename(req.params.filename));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'File not found.' });
  }
  fs.unlinkSync(filePath);
  res.json({ success: true });
});

module.exports = router;
