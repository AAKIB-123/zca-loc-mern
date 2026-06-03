const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "hero", "about", "contacts"
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

ContentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', ContentSchema);
