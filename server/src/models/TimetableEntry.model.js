/**
 * File: src/models/TimetableEntry.model.js
 * Description: Mongoose model representing a single timetable/class entry
 * belonging to a user and linked to a subject.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timetableEntrySchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    subject: { 
        type: Schema.Types.ObjectId, 
        ref: 'Subject', 
        required: true 
    },
    dayOfWeek: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: { 
        type: String, 
        required: true // Format "HH:MM" e.g., "09:00"
    },
    endTime: { 
        type: String, 
        required: true   // Format "HH:MM" e.g., "10:00"
    },
    professor: { 
        type: String, 
        trim: true 
    },
    location: { 
        type: String, 
        trim: true      // e.g., "Room 301"
    }
}, { timestamps: true });

module.exports = mongoose.model('TimetableEntry', timetableEntrySchema);