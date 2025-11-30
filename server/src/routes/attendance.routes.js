/**
 * File: src/routes/attendance.routes.js
 * Description: API routes for attendance records. Provides endpoints to create
 * and manage attendance entries for users/subjects.
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance.model');

// Add / update attendance (uses findOneAndUpdate with upsert)
router.post('/', auth, async (req, res) => {
  try {
    const { subjectId, date, status } = req.body;
    const recordDate = date ? new Date(date) : new Date();
    const record = await Attendance.findOneAndUpdate(
      { userId: req.userId, subjectId, date: recordDate },
      { userId: req.userId, subjectId, date: recordDate, status },
      { new: true, upsert: true }
    );
    res.status(200).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get attendance for a user (all records)
router.get('/', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.userId });
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /:subjectId - Get records for one subject
router.get('/:subjectId', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.userId, subjectId: req.params.subjectId });
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /stats/:subjectId - Get percentage for a subject
router.get('/stats/:subjectId', auth, async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const totalClasses = await Attendance.countDocuments({ userId: req.userId, subjectId });
    const attendedClasses = await Attendance.countDocuments({ userId: req.userId, subjectId, status: 'attended' });
    const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    res.status(200).json({ 
      percentage: Number(percentage.toFixed(2)),
      totalClasses,
      attendedClasses
     });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
