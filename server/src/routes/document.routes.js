/**
 * File: src/routes/document.routes.js
 * Description: Document upload and management endpoints. Uses multer to store
 * files under `uploads/` and persists metadata to the Document model.
 */

const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Document = require('../models/Document.model');

// --- Multer Configuration for File Storage ---
// This saves files to a local 'uploads' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename to prevent overwrites
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// All routes are protected
router.use(auth);

// POST /api/documents/upload - Upload a new document
router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        const { subjectId } = req.body;
        const { originalname, path, mimetype } = req.file;

        const newDocument = await Document.create({
            user: req.userId,
            subject: subjectId,
            fileName: originalname,
            filePath: path,
            fileType: mimetype
        });
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({ message: "Error uploading document", error });
    }
});

// GET /api/documents/subject/:subjectId - Get all documents for a subject
router.get('/subject/:subjectId', async (req, res) => {
    try {
        const documents = await Document.find({ user: req.userId, subject: req.params.subjectId });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error });
    }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', async (req, res) => {
    try {
        const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!doc) return res.status(404).json({ message: "Document not found" });

        // IMPORTANT: Also delete the physical file from the server
        fs.unlink(doc.filePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });
        
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting document", error });
    }
});

module.exports = router;