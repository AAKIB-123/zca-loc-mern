const router = require('express').Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');

// GET /api/content/:key  — public
router.get('/:key', async (req, res) => {
  try {
    const doc = await Content.findOne({ key: req.params.key });
    if (!doc) return res.status(404).json({ message: 'Content not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/content  — get all (public)
router.get('/', async (req, res) => {
  try {
    const docs = await Content.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/content/:key  — admin only (upsert)
router.put('/:key', auth, async (req, res) => {
  try {
    const doc = await Content.findOneAndUpdate(
      { key: req.params.key },
      { data: req.body.data, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
