/**
 * File: src/routes/auth.routes.js
 * Description: Authentication routes. Handles user registration, login,
 * password reset flows, profile management, and account deletion.
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/auth');

// --- Import ALL Models for Cascading Delete ---
const User = require('../models/User.model');
const Notes = require('../models/Notes.model');
const Task = require('../models/Task.model');
const Subject = require('../models/Subject.model');
const Attendance = require('../models/Attendance.model');
const TimetableEntry = require('../models/TimetableEntry.model');
const Document = require('../models/Document.model');
const Conversation = require('../models/Conversation.model');

// POST /api/auth/register  -  Creates a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully.", userId: newUser._id });

    } catch (error) {
        res.status(500).json({ message: "Server error during registration.", error });
    }
});

// POST /api/auth/login  -  Authenticates a user and returns a token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." }); // Use a generic message
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Create a JWT payload
        const payload = { userId: user._id, email: user.email };

        // Sign the token
        const authToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { algorithm: 'HS256', expiresIn: '6h' }
        );

        // GET /api/auth/me - return current user profile (protected)
        router.get('/me', authMiddleware, async (req, res) => {
            try {
                const user = await User.findById(req.user.user?.id || req.user.userId || req.user.userId).select('-password -passwordResetToken -passwordResetExpires');
                if (!user) return res.status(404).json({ message: 'User not found' });
                res.json({ user });
            } catch (err) {
                res.status(500).json({ message: 'Server error', error: err.message });
            }
        });

        res.status(200).json({ authToken: authToken });

    } catch (error) {
        res.status(500).json({ message: "Server error during login.", error });
    }
});


// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // For security, don't reveal if user exists
            return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Save token & expire time (1 hour)
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 3600000; 
        await user.save();

        // Send Email (using Nodemailer)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `Click this link to reset your password: ${resetUrl}`
        });

        res.status(200).json({ message: "Reset link sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        // Find user by token and check expiration ($gt means "greater than" now)
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset fields
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// GET /api/auth/me - Fetch current user details
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Find the user by the ID in the JWT token (req.userId)
        // .select('-password') ensures we don't send the password hash back
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error." });
    }
});


// PUT /api/auth/update - Update User Profile (Username)
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { username } = req.body;

        // Validation
        if (!username || username.trim() === '') {
            return res.status(400).json({ message: "Username cannot be empty." });
        }

        // Find and update
        // { new: true } returns the updated document instead of the old one
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { username },
            { new: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error during profile update." });
    }
});

// PUT /api/auth/change-password - Change Password
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both current and new passwords." });
        }

        const user = await User.findById(req.userId);

        // 1. Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        // 2. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update and save
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Password change error:", error);
        res.status(500).json({ message: "Server error during password change." });
    }
});

// DELETE /api/auth/delete - Delete Account
router.delete('/delete', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Delete all related data first
        await Promise.all([
            Notes.deleteMany({ user: userId }),
            Task.deleteMany({ user: userId }),
            Subject.deleteMany({ user: userId }),
            Attendance.deleteMany({ user: userId }), // Uses 'userId' in schema, check your model if it uses 'user'
            TimetableEntry.deleteMany({ user: userId }),
            Document.deleteMany({ user: userId }),
            Conversation.deleteMany({ user: userId })
        ]);

        // 2. Finally, delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Account and all data deleted successfully." });
    } catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({ message: "Server error during account deletion." });
    }
});

module.exports = router;

