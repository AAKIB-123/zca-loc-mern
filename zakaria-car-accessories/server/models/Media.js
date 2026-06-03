const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  type: { type: String, enum: ['image', 'video'], required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number },
  mimetype: { type: String },
  category: { type: String, default: 'general' }, // gallery, banner, product, etc.
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', MediaSchema);
