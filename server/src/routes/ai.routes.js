/**
 * File: src/routes/ai.routes.js
 * Description: Routes for AI-related endpoints (placeholder). Handles requests
 * to AI assistant features and forwards them to the AI service.
 */

const router = require('express').Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');



const Note = require('../models/Notes.model');
const TimetableEntry = require('../models/TimetableEntry.model');
const Task = require('../models/Task.model');
const Subject = require('../models/Subject.model');
const Conversation = require('../models/Conversation.model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.use(auth);

// POST /api/ai/chat - Main endpoint for sending a message
router.post('/chat', async (req, res) => {
    try {
        let { message, conversationId, context } = req.body;
        const userId = req.userId;
        let conversation;

        // --- 1. LOAD OR CREATE CONVERSATION ---
        if (conversationId) {
            conversation = await Conversation.findOne({ _id: conversationId, user: userId });
        } else {
            const title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
            conversation = await Conversation.create({ user: userId, title: title, history: [] });
            conversationId = conversation._id;
        }
        if (!conversation) return res.status(404).json({ message: "Conversation not found." });

        // --- 2. CONTEXT-AWARE PROMPT ENGINEERING ---
        let fullPrompt = message;
        let systemInstruction = "";
        if (context) {
            if (context.type === 'summarize' && context.noteId) {
                const note = await Note.findOne({ _id: context.noteId, user: userId });
                if (note) {
                    systemInstruction += ` The user wants to summarize the following note titled "${note.title}". Note Content: ${note.content}`;
                    fullPrompt = "Please summarize the note content you were provided with.";
                }
            }
            else if (context.type === 'create_study_plan' && context.subjectId) {
                // Find the subject to make the prompt more specific
                const subject = await Subject.findById(context.subjectId);
                const subjectName = subject ? subject.name : "the subject";

                systemInstruction += ` The user's attendance is low in ${subjectName}. Your task is to act as a supportive academic advisor.`;
                fullPrompt = `My attendance for ${subjectName} is low and I'm struggling. Can you create a simple but effective 3-day study plan to help me catch up? Please be encouraging.`;
            }
            // ... other context checks
        }

        // --- 3. CONVERSATIONAL MEMORY ---
        const cleanedHistory = conversation.history.map(item => ({
            role: item.role,
            parts: item.parts.map(part => ({
                text: part.text
            }))
        }));

        const chat = model.startChat({
            history: cleanedHistory,
        });

        // --- 4. SEND TO GEMINI API ---
        const finalPrompt = systemInstruction ? `${systemInstruction}\n\n${fullPrompt}` : fullPrompt;; // Simplified for clarity
        const result = await chat.sendMessage(finalPrompt);
        const response = result.response;
        const aiReply = response.text();;

        // --- 5. SAVE CHAT HISTORY TO DATABASE ---
        conversation.history.push({ role: 'user', parts: [{ text: message }] }); // Still save the original message
        conversation.history.push({ role: 'model', parts: [{ text: aiReply }] });
        await conversation.save();

        res.status(200).json({ reply: aiReply, conversationId: conversationId });

    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.status(500).json({ message: "Failed to get a response from the AI assistant." });
    }
});

// --- NEW ENDPOINTS FOR MANAGING CONVERSATIONS ---

// GET /api/ai/conversations - Get a list of all past chats
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find({ user: req.userId }).select('title createdAt').sort({ createdAt: -1 });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching conversations." });
    }
});

// GET /api/ai/conversations/:id - Get the full history of a single chat
router.get('/conversations/:id', async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, user: req.userId });
        if (!conversation) return res.status(404).json({ message: "Conversation not found." });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching conversation." });
    }
});

// DELETE /api/ai/conversations/:id - Delete a chat
router.delete('/conversations/:id', async (req, res) => {
    try {
        const deleted = await Conversation.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deleted) return res.status(404).json({ message: "Conversation not found." });
        res.status(200).json({ message: "Conversation deleted." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting conversation." });
    }
});

module.exports = router;