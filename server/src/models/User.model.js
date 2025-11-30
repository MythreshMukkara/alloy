/**
 * File: src/models/User.model.js
 * Description: Mongoose schema and model for application users. Stores basic
 * authentication information and password reset tokens.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
}, {
    // This option adds `createdAt` and `updatedAt` fields
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;