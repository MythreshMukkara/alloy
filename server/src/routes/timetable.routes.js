/**
 * File: src/routes/timetable.routes.js
 * Description: Timetable entry CRUD endpoints. Allows users to create and
 * manage their class schedule entries.
 */

const router = require('express').Router();
const TimetableEntry = require('../models/TimetableEntry.model');
const auth = require('../middleware/auth');

router.use(auth);

// POST /api/timetable - Create a new timetable entry
router.post('/', async (req, res) => {
    try {
        const { subject, dayOfWeek, startTime, endTime, professor, location } = req.body;
        const newEntry = await TimetableEntry.create({ 
            user: req.userId, 
            subject, 
            dayOfWeek, 
            startTime, 
            endTime, 
            professor, 
            location 
        });
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: "Error creating timetable entry", error });
    }
});

// GET /api/timetable - Get all entries for the user
router.get('/', async (req, res) => {
    try {
        const allEntries = await TimetableEntry.find({ user: req.userId }).populate('subject', 'name');
        res.status(200).json(allEntries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching timetable entries", error });
    }
});

// PUT /api/timetable/:id - Update an entry
router.put('/:id', async (req, res) => {
    try {
        const updatedEntry = await TimetableEntry.findOneAndUpdate(
            { _id: req.params.id, user: req.userId }, 
            req.body, 
            { new: true }
        );
        if (!updatedEntry) return res.status(404).json({ message: "Entry not found" });
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: "Error updating timetable entry", error });
    }
});

// DELETE /api/timetable/:id - Delete an entry
router.delete('/:id', async (req, res) => {
    try {
        const deletedEntry = await TimetableEntry.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deletedEntry) return res.status(404).json({ message: "Entry not found" });
        res.status(200).json({ message: "Entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting timetable entry", error });
    }
});

module.exports = router;