/**
 * File: src/routes/subjects.routes.js
 * Description: CRUD routes for subjects. Includes cascading delete to remove
 * related notes, attendance, documents, and tasks when a subject is deleted.
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Subject = require('../models/Subject.model');

// --- Import related models for Cascading Delete ---
const TimetableEntry = require('../models/TimetableEntry.model');
const Notes = require('../models/Notes.model');
const Attendance = require('../models/Attendance.model');
const Document = require('../models/Document.model');
const Task = require('../models/Task.model');

// POST /api/subjects - Create
router.post('/', auth, async (req, res) => {
  try {
    const newSubject = await Subject.create({ ...req.body, user: req.userId });
    res.status(201).json(newSubject);
  } catch (err) { res.status(500).send('Server error'); }
});

// GET /api/subjects - Read all
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.userId });
    res.status(200).json(subjects);
  } catch (err) { res.status(500).send('Server error'); }
});

// PUT /api/subjects/:id - Update
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!updatedSubject) return res.status(404).json({ msg: 'Subject not found' });
        res.status(200).json(updatedSubject);
    } catch (err) { res.status(500).send('Server error'); }
});

// --- UPDATED DELETE ROUTE ---
// DELETE /api/subjects/:id - Delete Subject AND all related data
router.delete('/:id', auth, async (req, res) => {
    try {
        const subjectId = req.params.id;
        const userId = req.userId;

        // 1. Verify the subject exists and belongs to the user
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) return res.status(404).json({ msg: 'Subject not found' });

        // 2. Delete all related data (Cascading Delete)
        await Promise.all([
            // Remove this subject from the Timetable
            TimetableEntry.deleteMany({ subject: subjectId }),
            
            // Remove all Notes for this subject
            Notes.deleteMany({ subject: subjectId }),
            
            // Remove Attendance records (Note: Attendance model uses 'subjectId')
            Attendance.deleteMany({ subjectId: subjectId }),
            
            // Remove Uploaded Documents
            Document.deleteMany({ subject: subjectId }),
            
            // Remove Tasks linked to this subject (if any)
            Task.deleteMany({ subject: subjectId })
        ]);

        // 3. Finally, delete the subject itself
        await Subject.findByIdAndDelete(subjectId);

        res.json({ msg: 'Subject and all related data deleted successfully' });
    } catch (err) { 
        console.error("Error deleting subject:", err);
        res.status(500).send('Server error'); 
    }
});

module.exports = router;