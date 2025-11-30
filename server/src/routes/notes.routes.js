/**
 * File: src/routes/notes.routes.js
 * Description: CRUD endpoints for user notes. Notes are linked to subjects
 * and to the authenticated user.
 */

const router = require('express').Router();
const Note = require('../models/Notes.model');
const auth = require('../middleware/auth');


// POST /api/notes - Create a new note
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, subjectId } = req.body;
        if (!subjectId) return res.status(400).json({ message: "Subject ID is required." });

        const newNote = await Note.create({ 
            title, 
            content, 
            subject: subjectId, 
            user: req.userId 
        });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Error creating note", error });
    }
});

// GET /api/notes/subject/:subjectId - Get all notes for a specific subject
router.get('/subject/:subjectId', auth, async (req, res) => {
    try {
        const notes = await Note.find({ subject: req.params.subjectId, user: req.userId });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes", error });
    }
});

// GET /api/notes/:noteId - Get a single note by its ID
router.get('/:noteId', auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.noteId, user: req.userId });
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Error fetching note", error });
    }
});

// PUT /api/notes/:noteId - Update a note
router.put('/:noteId', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.noteId, user: req.userId },
            { title, content },
            { new: true }
        );
        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: "Error updating note", error });
    }
});

// DELETE /api/notes/:noteId - Delete a note
router.delete('/:noteId', auth, async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.noteId, user: req.userId });
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting note", error });
    }
});

module.exports = router;