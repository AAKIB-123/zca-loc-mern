const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const auth = require('../middleware/auth');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/');
    const folder = isVideo ? 'uploads/videos' : 'uploads/images';
    fs.mkdirSync(path.join(__dirname, '..', folder), { recursive: true });
    cb(null, path.join(__dirname, '..', folder));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv|webm/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  cb(null, allowed.test(ext));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

// GET /api/media  — public, optional ?type=image|video&category=gallery
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    const media = await Media.find(filter).sort({ order: 1, uploadedAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/media  — admin only
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const isVideo = req.file.mimetype.startsWith('video/');
    const folder = isVideo ? 'videos' : 'images';
    const url = `/uploads/${folder}/${req.file.filename}`;

    const media = await Media.create({
      title: req.body.title || req.file.originalname,
      type: isVideo ? 'video' : 'image',
      filename: req.file.filename,
      url,
      size: req.file.size,
      mimetype: req.file.mimetype,
      category: req.body.category || 'general',
      featured: req.body.featured === 'true',
      order: Number(req.body.order) || 0,
    });

    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/media/:id  — update title/category/featured/order (admin only)
router.patch('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!media) return res.status(404).json({ message: 'Not found' });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/media/:id  — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Not found' });

    // Delete file from disk
    const folder = media.type === 'video' ? 'videos' : 'images';
    const filePath = path.join(__dirname, '..', 'uploads', folder, media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await media.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
