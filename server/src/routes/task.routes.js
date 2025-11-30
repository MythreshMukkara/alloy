/**
 * File: src/routes/task.routes.js
 * Description: Task management endpoints supporting create/read/update/delete
 * operations plus filtering and priority-based sorting.
 */

const router = require('express').Router();
const Task = require('../models/Task.model');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// POST /api/tasks - Create a new task/event (no changes needed here)
router.post('/', auth, async (req, res) => {
    try {
        // Now accepts priority and status from the request body
        const { description, dueDate, startTime, endTime, priority, status } = req.body;
        const newTask = await Task.create({ 
            user: req.userId, 
            description, 
            dueDate, 
            startTime, 
            endTime, 
            priority, 
            status 
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
});

// GET /api/tasks - Get all tasks with filtering and sorting (UPDATED)
router.get('/', auth, async (req, res) => {
    try {
        const { status, dueDate, sortBy } = req.query;
        const findQuery = { user: req.userId };
        
        // Filtering logic remains the same
        if (status && status !== 'All') {
            findQuery.status = status;
        }
        if (dueDate) {
            const startOfDay = new Date(dueDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(dueDate);
            endOfDay.setHours(23, 59, 59, 999);
            findQuery.dueDate = { $gte: startOfDay, $lte: endOfDay };
        }

        let allTasks;

        if (sortBy === 'priority') {

            const aggregateQuery = { ...findQuery };
            aggregateQuery.user = new mongoose.Types.ObjectId(req.userId);
            const pipeline = [
                { $match: aggregateQuery },
                {
                    $addFields: {
                        priorityOrder: {
                            $switch: {
                                branches: [
                                    { case: { $eq: [{ $toLower: '$priority' }, 'high'] }, then: 1 },
                                    { case: { $eq: [{ $toLower: '$priority' }, 'medium'] }, then: 2 },
                                    { case: { $eq: [{ $toLower: '$priority' }, 'low'] }, then: 3 }
                                ],
                                default: 4
                            }
                        }
                    }
                },
                { $sort: { priorityOrder: 1 } }
            ];
            allTasks = await Task.aggregate(pipeline);
        } else {
            const sortQuery = sortBy === 'dueDate' ? { dueDate: 1 } : { createdAt: -1 };
            allTasks = await Task.find(findQuery).sort(sortQuery);
        }

        res.status(200).json(allTasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
});



// PUT /api/tasks/:id - Update a task (no changes needed here)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
});

// DELETE /api/tasks/:id - Delete a task (no changes needed here)
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
});

module.exports = router;