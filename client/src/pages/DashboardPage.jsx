/**
 * File: client/src/pages/DashboardPage.jsx
 * Description: Main dashboard page showing quick summaries and actions.
 */

import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api.service';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';
import { 
    FaCalendarAlt, FaTasks, FaRegCalendarCheck, FaBook, 
    FaRobot, FaCode, FaArrowRight, FaClock, FaCheckCircle, 
    FaExclamationCircle, FaGraduationCap 
} from 'react-icons/fa';

function DashboardPage() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ classesToday: 0, tasksPending: 0, lowAttendanceCount: 0 });
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [attendanceWatchlist, setAttendanceWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = new Date().toLocaleString('en-us', { weekday: 'long' });
                
                // 1. Fetch Schedule
                const scheduleRes = await api.get('/timetable');
                const todaysClasses = scheduleRes.data.filter(item => item.dayOfWeek === today);
                
                // Sort classes by time
                todaysClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));
                setTodaySchedule(todaysClasses);

                // 2. Fetch Tasks
                const tasksRes = await api.get('/tasks?status=To Do&sortBy=dueDate');
                setUpcomingTasks(tasksRes.data.slice(0, 4));

                // 3. Fetch Attendance & Watchlist
                const subjectsRes = await api.get('/subjects');
                const watchlist = [];
                let lowAttendanceCounter = 0;

                await Promise.all(subjectsRes.data.map(async (sub) => {
                    const statsRes = await api.get(`/attendance/stats/${sub._id}`);
                    if (statsRes.data.percentage < sub.requiredPercentage) {
                        watchlist.push({ ...sub, percentage: statsRes.data.percentage });
                        lowAttendanceCounter++;
                    }
                }));
                setAttendanceWatchlist(watchlist.slice(0, 3));

                // 4. Set Summary Stats
                setStats({
                    classesToday: todaysClasses.length,
                    tasksPending: tasksRes.data.length,
                    lowAttendanceCount: lowAttendanceCounter
                });

            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                        {getGreeting()}, {user?.username?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Here's what's happening in your academic life today.
                    </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Overview Rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-none relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium mb-1">Classes Today</p>
                        <h3 className="text-4xl font-bold">{stats.classesToday}</h3>
                    </div>
                    <FaCalendarAlt className="absolute right-4 bottom-4 text-blue-400/40 text-6xl" />
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 dark:shadow-none relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-purple-100 font-medium mb-1">Pending Tasks</p>
                        <h3 className="text-4xl font-bold">{stats.tasksPending}</h3>
                    </div>
                    <FaTasks className="absolute right-4 bottom-4 text-purple-400/40 text-6xl" />
                </div>

                <div className={`rounded-2xl p-6 text-white shadow-lg relative overflow-hidden ${stats.lowAttendanceCount > 0 ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-200 dark:shadow-none' : 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-200 dark:shadow-none'}`}>
                    <div className="relative z-10">
                        <p className={`${stats.lowAttendanceCount > 0 ? 'text-red-100' : 'text-green-100'} font-medium mb-1`}>Attendance Alert</p>
                        <h3 className="text-4xl font-bold">{stats.lowAttendanceCount}</h3>
                        <p className="text-xs opacity-80 mt-1">{stats.lowAttendanceCount > 0 ? 'Subjects need attention' : 'You are on track!'}</p>
                    </div>
                    <FaRegCalendarCheck className={`absolute right-4 bottom-4 text-6xl ${stats.lowAttendanceCount > 0 ? 'text-red-400/40' : 'text-green-400/40'}`} />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Schedule (Timeline) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FaClock className="text-blue-500" /> Today's Schedule
                            </h2>
                            <Link to="/app/schedule" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View Full</Link>
                        </div>

                        {todaySchedule.length > 0 ? (
                            <div className="space-y-0">
                                {todaySchedule.map((item, index) => (
                                    <div key={item._id} className="relative pl-8 pb-8 last:pb-0 group">
                                        {/* Timeline Line */}
                                        <div className="absolute left-2.5 top-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700 group-last:hidden"></div>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 top-2 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 bg-blue-500 shadow-sm"></div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900">
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-white text-lg">{item.subject.name}</h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    <span className="flex items-center gap-1"><FaClock size={12}/> {item.startTime} - {item.endTime}</span>
                                                    {item.location && <span className="flex items-center gap-1">📍 {item.location}</span>}
                                                </div>
                                            </div>
                                            {item.professor && (
                                                <div className="mt-2 sm:mt-0 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full self-start">
                                                    {item.professor}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                                <div className="text-gray-300 dark:text-gray-600 text-5xl mb-3">🎉</div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No classes today!</p>
                                <p className="text-sm text-gray-400">Enjoy your free time or catch up on tasks.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { to: "/app/notes", icon: <FaBook />, label: "Notes", color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" },
                            { to: "/app/ai-assistant", icon: <FaRobot />, label: "AI Help", color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
                            { to: "/app/attendance", icon: <FaRegCalendarCheck />, label: "Tracker", color: "text-green-500 bg-green-50 dark:bg-green-900/20" },
                            { to: "/app/schedule", icon: <FaCalendarAlt />, label: "Time Table", color: "text-pink-500 bg-pink-50 dark:bg-pink-900/20" },
                        ].map((link, i) => (
                            <Link key={i} to={link.to} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-200 group">
                                <div className={`text-2xl mb-2 p-3 rounded-full ${link.color} group-hover:scale-110 transition-transform`}>{link.icon}</div>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Column: Tasks & Alerts */}
                <div className="space-y-8">
                    
                    {/* Tasks Widget */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FaCheckCircle className="text-green-500" /> Priorities
                            </h2>
                            <Link to="/app/schedule" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <FaArrowRight className="text-gray-400" size={14} />
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                                <div key={task._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{task.description}</p>
                                        {task.dueDate && <p className="text-xs text-gray-400 mt-0.5">{new Date(task.dueDate).toLocaleDateString()}</p>}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500 text-center py-4">No pending tasks.</p>
                            )}
                        </div>
                        <Link to="/app/schedule" className="block mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
                            + Add New Task
                        </Link>
                    </div>

                    {/* Watchlist Widget */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                            <FaExclamationCircle className="text-red-500" /> Attendance Risk
                        </h2>
                        {attendanceWatchlist.length > 0 ? (
                            <div className="space-y-4">
                                {attendanceWatchlist.map(sub => (
                                    <div key={sub._id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{sub.name}</span>
                                            <span className="font-bold text-red-500">{sub.percentage}%</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div 
                                                className="bg-red-500 h-2.5 rounded-full" 
                                                style={{ width: `${sub.percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Target: {sub.requiredPercentage}%</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <FaGraduationCap className="text-4xl text-green-200 dark:text-green-900/30 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Great job! All attendance is above requirements.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DashboardPage;