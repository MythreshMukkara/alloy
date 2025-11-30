import React, { useState, useEffect, useCallback } from 'react';
/**
 * File: client/src/components/TasksComponent.jsx
 * Description: Component for showing, filtering and managing tasks.
 */
import api from '../services/api.service';
import { FaTrash, FaPlus, FaFilter, FaSortAmountDown, FaCheckCircle, FaCircle, FaExclamationCircle } from 'react-icons/fa';

function TasksComponent() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({ description: '', priority: 'Medium', dueDate: '' });
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('dueDate');
    const [isFormOpen, setIsFormOpen] = useState(false); // Collapsible form state

    const fetchTasks = useCallback(async () => {
        try {
            let url = '/tasks?';
            if (filterStatus !== 'All') {
                url += `status=${encodeURIComponent(filterStatus)}&`;
            }
            if (sortBy) {
                url += `sortBy=${sortBy}`;
            }
            const response = await api.get(url);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }, [filterStatus, sortBy]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!formData.description.trim()) return;
        try {
            await api.post('/tasks', formData);
            setFormData({ description: '', priority: 'Medium', dueDate: '' });
            fetchTasks();
            setIsFormOpen(false); // Close form on mobile/tablet after adding
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleUpdateTask = async (id, updatedData) => {
        try {
            await api.put(`/tasks/${id}`, updatedData);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm("Delete this task?")) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    // Style helpers
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Done': return <FaCheckCircle className="text-green-500" />;
            case 'In Progress': return <FaExclamationCircle className="text-blue-500" />;
            case 'Missed': return <FaExclamationCircle className="text-red-500" />;
            default: return <FaCircle className="text-gray-300" />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6">
            
            {/* 1. Task List Area (Main Content) */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                
                {/* Header & Controls */}
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Tasks</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your to-dos and assignments</p>
                    </div>
                    
                    {/* Filter & Sort Toolbar */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)} 
                                className="pl-8 pr-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Completed</option>
                                <option value="Missed">Missed</option>
                            </select>
                        </div>
                        <div className="relative">
                            <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)} 
                                className="pl-8 pr-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
                            >
                                <option value="dueDate">Due Date</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                        <button 
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="lg:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaPlus />
                        </button>
                    </div>
                </div>

                {/* Task List Container */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                    {tasks.length > 0 ? tasks.map(task => (
                        <div 
                            key={task._id} 
                            className={`group p-4 rounded-xl border transition-all hover:shadow-md bg-white dark:bg-gray-800 
                                ${task.status === 'Done' ? 'opacity-60 border-gray-100 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    {/* Interactive Status Icon */}
                                    <button 
                                        onClick={() => handleUpdateTask(task._id, { status: task.status === 'Done' ? 'To Do' : 'Done' })}
                                        className="mt-1 focus:outline-none transform active:scale-90 transition-transform"
                                        title={task.status === 'Done' ? "Mark as Undone" : "Mark as Done"}
                                    >
                                        {getStatusIcon(task.status)}
                                    </button>
                                    
                                    <div>
                                        <h3 className={`font-semibold text-gray-800 dark:text-gray-100 ${task.status === 'Done' ? 'line-through text-gray-500' : ''}`}>
                                            {task.description}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            {task.dueDate && (
                                                <span className={`text-xs px-2 py-0.5 rounded ${new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'bg-red-100 text-red-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Quick Status Actions */}
                                    {task.status !== 'Done' && (
                                        <select 
                                            value={task.status} 
                                            onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                                            className="text-xs bg-transparent border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 text-gray-500 focus:outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <option>To Do</option>
                                            <option>In Progress</option>
                                            <option>Missed</option>
                                        </select>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteTask(task._id)} 
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4">
                                <FaCheckCircle className="text-4xl text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">You have no tasks on your list. Add one to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Add Task Sidebar (Always visible on Desktop, Collapsible on Mobile) */}
            <div className={`lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col 
                ${isFormOpen ? 'fixed inset-0 z-50 m-4 lg:m-0 lg:static' : 'hidden lg:flex'}`}>
                
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 dark:text-white">Add New Task</h2>
                    <button onClick={() => setIsFormOpen(false)} className="lg:hidden text-gray-500"><FaPlus className="rotate-45" /></button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto">
                    <form onSubmit={handleAddTask} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">What needs doing?</label>
                            <input 
                                type="text" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                placeholder="e.g., Submit Physics Assignment"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                                <div className="flex gap-2">
                                    {['Low', 'Medium', 'High'].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: p })}
                                            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${formData.priority === p 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                            <input 
                                type="date" 
                                name="dueDate" 
                                value={formData.dueDate} 
                                onChange={handleChange} 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-600 dark:text-gray-200" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95"
                        >
                            Create Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TasksComponent;