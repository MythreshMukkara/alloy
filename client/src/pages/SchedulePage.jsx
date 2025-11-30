/**
 * File: client/src/pages/SchedulePage.jsx
 * Description: Page that displays the user's schedule/timetable component.
 */
import React, { useState } from 'react';
import TimetableComponent from '../components/TimetableComponent';
import TasksComponent from '../components/TasksComponent';
import { FaCalendarAlt, FaTasks } from 'react-icons/fa';

function SchedulePage() {
    const [activeTab, setActiveTab] = useState('timetable');

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header & Tab Switcher */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Schedule Manager</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Organize your weekly classes and daily tasks</p>
                </div>

                {/* Modern Segmented Control */}
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('timetable')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 
                            ${activeTab === 'timetable' 
                                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <FaCalendarAlt /> Timetable
                    </button>
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 
                            ${activeTab === 'tasks' 
                                ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <FaTasks /> Tasks
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'timetable' ? (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <TimetableComponent />
                    </div>
                ) : (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <TasksComponent />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SchedulePage;