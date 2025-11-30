/**
 * File: src/models/Attendance.model.js
 * Description: Attendance records per user/subject/date. Includes a
 * pre-save hook to normalize the date and a unique index to prevent duplicates.
 */

const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['attended', 'missed'], required: true }
}, { timestamps: true });

// Normalize date to start-of-day (UTC) before saving so comparisons/upserts work consistently
AttendanceSchema.pre('save', function(next) {
  if (this.date) {
    try {
      const d = new Date(this.date);
      const iso = d.toISOString().split('T')[0];
      this.date = new Date(iso); // midnight UTC for that date
    } catch (e) {
      // ignore
    }
  }
  next();
});

// Ensure uniqueness per user/subject/date to avoid duplicate records
AttendanceSchema.index({ userId: 1, subjectId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
