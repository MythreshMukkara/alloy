/**
 * File: src/models/Task.model.js
 * Description: Mongoose model for tasks and events. Includes fields for
 * scheduling, priority, and status.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true, trim: true },
    
    // MODIFIED: Replaced 'completed' with a more descriptive status
    status: { 
        type: String,
        required: true,
        enum: ['To Do', 'In Progress', 'Done', 'Missed'], // Possible statuses
        default: 'To Do'
    },
    
    // NEW: Added a priority field
    priority: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },

    // For simple To-Dos
    dueDate: { type: Date }, 
    // For Study Planner events
    startTime: { type: Date },
    endTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);