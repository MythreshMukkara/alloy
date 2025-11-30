/**
 * File: src/models/Subject.model.js
 * Description: Subject model representing academic subjects linked to a user.
 */

const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  requiredPercentage: { type: Number, default: 75 }
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
