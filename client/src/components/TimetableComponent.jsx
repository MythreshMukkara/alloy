/**
 * File: client/src/components/TimetableComponent.jsx
 * Description: UI component that displays and edits the weekly timetable.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api.service';
import { FaPlus, FaTrash, FaPen, FaClock, FaMapMarkerAlt, FaChalkboardTeacher } from 'react-icons/fa';
import Modal from './Modal';

function TimetableComponent() {
    const [timetable, setTimetable] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ subject: '', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', professor: '', location: '' });
    const [editingId, setEditingId] = useState(null);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Generate time slots from 08:00 to 18:00
    const timeSlots = Array.from({ length: 11 }, (_, i) => {
        const hour = i + 8;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    // Get current day index to highlight the column
    const currentDayIndex = new Date().getDay() - 1; // 0 is Sunday in JS, but our array starts Mon
    const adjustedCurrentDayIndex = currentDayIndex === -1 ? 6 : currentDayIndex;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [timetableRes, subjectsRes] = await Promise.all([
                api.get('/timetable'),
                api.get('/subjects')
            ]);
            setTimetable(timetableRes.data);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleOpenModal = (entry = null) => {
        if (entry) {
            setFormData({
                subject: entry.subject._id,
                dayOfWeek: entry.dayOfWeek,
                startTime: entry.startTime,
                endTime: entry.endTime,
                professor: entry.professor || '',
                location: entry.location || ''
            });
            setEditingId(entry._id);
        } else {
            setFormData({
                subject: subjects && subjects.length > 0 ? subjects[0]._id : '',
                dayOfWeek: 'Monday',
                startTime: '09:00',
                endTime: '10:00',
                professor: '',
                location: ''
            });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/timetable/${editingId}`, formData);
            } else {
                await api.post('/timetable', formData);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving entry:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this class?")) {
            try {
                await api.delete(`/timetable/${id}`);
                setTimetable(timetable.filter(t => t._id !== id));
            } catch (error) {
                console.error("Error deleting entry:", error);
            }
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Helper to generate a consistent color based on subject name
    const getSubjectStyle = (subjectName) => {
        const colors = [
            'border-l-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100',
            'border-l-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-100',
            'border-l-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100',
            'border-l-orange-500 bg-orange-50 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100',
            'border-l-pink-500 bg-pink-50 text-pink-900 dark:bg-pink-900/20 dark:text-pink-100',
        ];
        let hash = 0;
        for (let i = 0; i < subjectName.length; i++) hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-20">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Weekly Schedule</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your classes and timings</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <FaPlus size={14} /> Add Class
                </button>
            </div>

            {/* Timetable Grid Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <div className="min-w-[1000px]"> {/* Ensures horizontal scroll on small screens */}
                    
                    {/* Table Header (Days) */}
                    <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <div className="p-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center border-r border-gray-200 dark:border-gray-700">
                            Time
                        </div>
                        {days.map((day, index) => (
                            <div 
                                key={day} 
                                className={`p-3 text-sm font-bold text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 
                                    ${index === adjustedCurrentDayIndex ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid Body */}
                    {timeSlots.map((time) => (
                        <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-100 dark:border-gray-700/50 last:border-b-0">
                            
                            {/* Time Column */}
                            <div className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 flex items-start justify-center pt-4">
                                {time}
                            </div>

                            {/* Days Columns */}
                            {days.map((day, index) => {
                                // Filter classes that start in this hour block
                                const entries = timetable.filter(e => e.dayOfWeek === day && e.startTime.startsWith(time.substring(0, 2)));
                                const isToday = index === adjustedCurrentDayIndex;

                                return (
                                    <div 
                                        key={`${day}-${time}`} 
                                        className={`p-2 border-r border-gray-100 dark:border-gray-700/50 min-h-[100px] transition-colors
                                            ${isToday ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''}`}
                                    >
                                        {entries.map(entry => (
                                            <div 
                                                key={entry._id} 
                                                className={`mb-2 p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all group relative ${getSubjectStyle(entry.subject.name)}`}
                                            >
                                                {/* Action Buttons (Show on Hover) */}
                                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(entry); }}
                                                        className="p-1.5 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-blue-600 shadow-sm"
                                                    >
                                                        <FaPen size={10} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(entry._id); }}
                                                        className="p-1.5 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-600 shadow-sm"
                                                    >
                                                        <FaTrash size={10} />
                                                    </button>
                                                </div>

                                                <div className="font-bold text-sm mb-1 pr-6 truncate">{entry.subject.name}</div>
                                                
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-xs opacity-80">
                                                        <FaClock className="mr-1.5 opacity-70" size={10} />
                                                        {entry.startTime} - {entry.endTime}
                                                    </div>
                                                    {entry.location && (
                                                        <div className="flex items-center text-xs opacity-80">
                                                            <FaMapMarkerAlt className="mr-1.5 opacity-70" size={10} />
                                                            {entry.location}
                                                        </div>
                                                    )}
                                                    {entry.professor && (
                                                        <div className="flex items-center text-xs opacity-80">
                                                            <FaChalkboardTeacher className="mr-1.5 opacity-70" size={10} />
                                                            {entry.professor}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Reusable Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Class' : 'Add Class'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <select 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleChange} 
                            className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="" disabled>Select a Subject</option>
                            {subjects && subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
                        <select 
                            name="dayOfWeek" 
                            value={formData.dayOfWeek} 
                            onChange={handleChange} 
                            className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                            <input 
                                type="time" 
                                name="startTime" 
                                value={formData.startTime} 
                                onChange={handleChange} 
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                            <input 
                                type="time" 
                                name="endTime" 
                                value={formData.endTime} 
                                onChange={handleChange} 
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                placeholder="e.g. Room 304"
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professor</label>
                            <input 
                                type="text" 
                                name="professor" 
                                value={formData.professor} 
                                onChange={handleChange} 
                                placeholder="e.g. Dr. Smith"
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)} 
                            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors shadow-sm"
                        >
                            Save Class
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default TimetableComponent;