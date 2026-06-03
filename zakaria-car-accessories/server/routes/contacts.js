// Contacts are stored as Content with key="contacts"
// This file is a placeholder – use /api/content/contacts for CRUD
const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: 'Use /api/content/contacts to get/update contact info' });
});

module.exports = router;
