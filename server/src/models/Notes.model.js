/**
 * File: src/models/Notes.model.js
 * Description: Schema for user notes. Notes are associated with a subject
 * and stored per user. Content may contain formatted text.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String, // Will store formatted text (e.g., HTML)
        required: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);