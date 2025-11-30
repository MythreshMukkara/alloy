/**
 * File: src/models/Conversation.model.js
 * Description: Model for storing AI assistant conversations per user. Keeps
 * a history array that records message roles and text parts.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'New Chat'
    },
    // This will store the back-and-forth messages
    history: [{
        role: {
            type: String,
            required: true,
            enum: ['user', 'model']
        },
        parts: [{
            text: { type: String }
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);