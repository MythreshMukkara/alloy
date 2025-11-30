/**
 * File: src/models/Document.model.js
 * Description: Stores metadata for uploaded documents (file path, type,
 * and associated subject/user). Actual file storage is handled by multer.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    fileName: { type: String, required: true }, 
    filePath: { type: String, required: true }, 
    fileType: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);