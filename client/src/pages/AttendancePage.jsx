/**
 * File: client/src/pages/AttendancePage.jsx
 * Description: Attendance tracking and statistics page.
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api.service';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Ensure you have the custom CSS override for dark mode
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaPlus, FaPen, FaTrash, FaCheckCircle, FaTimesCircle, FaRobot, FaChartPie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

ChartJS.register(ArcElement, Tooltip, Legend);

function AttendancePage() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [stats, setStats] = useState(null);
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentSubject, setCurrentSubject] = useState({ name: '', requiredPercentage: 75 });
    const navigate = useNavigate();

    const fetchSubjects = useCallback(async () => {
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
            if (response.data.length > 0 && !selectedSubject) {
                setSelectedSubject(response.data[0]);
            }
        } catch (error) { console.error("Error fetching subjects:", error); }
    }, [selectedSubject]);

    const fetchAttendanceData = useCallback(async (subjectId) => {
        try {
            const [recordsRes, statsRes] = await Promise.all([
                api.get(`/attendance/${subjectId}`),
                api.get(`/attendance/stats/${subjectId}`)
            ]);
            setAttendanceData(recordsRes.data);
            setStats(statsRes.data);
        } catch (error) { console.error("Error fetching attendance data:", error); }
    }, []);

    useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

    useEffect(() => {
        if (selectedSubject) fetchAttendanceData(selectedSubject._id);
    }, [selectedSubject, fetchAttendanceData]);

    const handleMarkAttendance = async (status) => {
        if (!selectedSubject) return;
        try {
            await api.post('/attendance', {
                subjectId: selectedSubject._id,
                // Fix: Adjust for timezone offset so we send the LOCAL date, not UTC
                date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0],
                status,
            });
            fetchAttendanceData(selectedSubject._id);
        } catch (error) { console.error("Error marking attendance:", error); }
    };

    const handleDeleteSubject = async (subjectId) => {
        if (window.confirm("Delete this subject and all its records?")) {
            try {
                await api.delete(`/subjects/${subjectId}`);
                await fetchSubjects();
                setSelectedSubject(null);
            } catch (error) { console.error("Error deleting subject:", error); }
        }
    };

    const handleGetStudyPlan = () => {
        if (selectedSubject) {
            navigate('/app/ai-assistant', { state: { context: { type: 'create_study_plan', subjectId: selectedSubject._id } } });
        }
    };

    // --- Modal Handlers ---
    const handleOpenAddModal = () => {
        setModalMode('add');
        setCurrentSubject({ name: '', requiredPercentage: 75 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (subject) => {
        setModalMode('edit');
        setCurrentSubject(subject);
        setIsModalOpen(true);
    };

    const handleSaveSubject = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') await api.post('/subjects', currentSubject);
            else await api.put(`/subjects/${currentSubject._id}`, currentSubject);
            fetchSubjects();
            setIsModalOpen(false);
        } catch (error) { console.error("Error saving subject:", error); }
    };

    // --- Visual Helpers ---
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const record = attendanceData.find(d => d.date.split('T')[0] === dateString);
            if (record) {
                return record.status === 'attended' ? 'attendance-tile-attended' : 'attendance-tile-missed';
            }
        }
    };

    const chartData = {
        labels: ['Attended', 'Missed'],
        datasets: [{
            data: [stats?.attendedClasses || 0, (stats?.totalClasses || 0) - (stats?.attendedClasses || 0)],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 2,
        }],
    };

    // Helper to check if the selected date is in the future
    const isFutureDate = (selectedDate) => {
        const today = new Date();
        // Reset time to midnight for accurate comparison
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">

            {/* 1. Subject Sidebar */}
            <div className="w-full lg:w-80 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
                    <h2 className="font-bold text-gray-800 dark:text-white">Subjects</h2>
                    <button onClick={handleOpenAddModal} className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors">
                        <FaPlus size={14} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {subjects.length > 0 ? subjects.map(sub => (
                        <div
                            key={sub._id}
                            onClick={() => setSelectedSubject(sub)}
                            className={`group p-3 rounded-lg cursor-pointer border transition-all duration-200 relative
                                ${selectedSubject?._id === sub._id
                                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 shadow-sm'
                                    : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`font-medium ${selectedSubject?._id === sub._id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {sub.name}
                                </span>
                                {/* Actions (Show on hover or active) */}
                                <div className={`flex gap-2 ${selectedSubject?._id === sub._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(sub); }} className="text-gray-400 hover:text-blue-500"><FaPen size={12} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSubject(sub._id); }} className="text-gray-400 hover:text-red-500"><FaTrash size={12} /></button>
                                </div>
                            </div>
                            {/* Requirement Indicator */}
                            <div className="mt-1 flex items-center text-xs text-gray-400">
                                <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">Req: {sub.requiredPercentage}%</span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-gray-400 py-8 text-sm">No subjects yet. Add one!</div>
                    )}
                </div>
            </div>

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                {selectedSubject && stats ? (
                    <>
                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Attendance</p>
                                    <p className={`text-2xl font-bold ${stats.percentage >= selectedSubject.requiredPercentage ? 'text-green-600' : 'text-red-600'}`}>{stats.percentage}%</p>
                                </div>
                                <div className="h-12 w-12 text-gray-200">
                                    <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalClasses}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Classes Missed</p>
                                <p className="text-2xl font-bold text-red-500">{(stats.totalClasses || 0) - (stats.attendedClasses || 0)}</p>
                            </div>
                        </div>

                        {/* Warning Banner */}
                        {stats.percentage < selectedSubject.requiredPercentage && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                                    <FaChartPie />
                                    <span className="text-sm font-medium">You are below the {selectedSubject.requiredPercentage}% requirement.</span>
                                </div>
                                <button
                                    onClick={handleGetStudyPlan}
                                    className="flex items-center gap-2 text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-bold"
                                >
                                    <FaRobot /> Get AI Plan
                                </button>
                            </div>
                        )}

                        {/* Calendar & Actions Section */}
                        <div className="flex flex-col xl:flex-row gap-6">
                            {/* Calendar */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span> Attendance Log
                                </h3>
                                <div className="calendar-container">
                                    <Calendar
                                        onChange={setDate}
                                        value={date}
                                        tileClassName={tileClassName}
                                        className=" w-full text-sm border border-black-200 dark:border-black-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-black-200 "
                                    />
                                </div>
                            </div>

                            {/* Action Panel */}
                            <div className="w-full xl:w-80 flex flex-col gap-4">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Mark Status</h3>
                                    <p className="text-sm text-gray-500 mb-6">Select a date on the calendar to update.</p>

                                    <div className="text-center mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">Selected Date</span>
                                        <span className="text-lg font-semibold text-gray-800 dark:text-white">{date.toDateString()}</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={() => handleMarkAttendance('attended')}
                                            disabled={isFutureDate(date)} // Disable if future
                                            className={`flex items-center justify-center gap-3 w-full py-3 rounded-lg border transition-all font-bold ${isFutureDate(date)
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' // Disabled Style
                                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}` // Active Style
                                            }
                                        >
                                            <FaCheckCircle size={18} /> Present
                                        </button>

                                        <button
                                            onClick={() => handleMarkAttendance('missed')}
                                            disabled={isFutureDate(date)} // Disable if future
                                            className={`flex items-center justify-center gap-3 w-full py-3 rounded-lg border transition-all font-bold ${isFutureDate(date)
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' // Disabled Style
                                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}` // Active Style
                                            }
                                        >
                                            <FaTimesCircle size={18} /> Absent
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <FaChartPie size={48} className="mb-4 opacity-20" />
                        <p>Select a subject to view details</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Subject' : 'Edit Subject'}>
                <form onSubmit={handleSaveSubject} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
                        <input type="text" value={currentSubject.name} onChange={(e) => setCurrentSubject({ ...currentSubject, name: e.target.value })} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Attendance (%)</label>
                        <input type="number" min="0" max="100" value={currentSubject.requiredPercentage} onChange={(e) => setCurrentSubject({ ...currentSubject, requiredPercentage: e.target.value })} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 font-medium transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium transition-colors">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default AttendancePage;