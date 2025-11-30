/**
 * File: client/src/components/MainLayout.jsx
 * Description: Main application layout for authenticated users. Provides
 * navigation and a left sidebar with links to app sections.
 */
import logo from '../assets/logo.png';
import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import {
    FaThLarge, FaCalendarAlt, FaRegCalendarCheck, FaStickyNote,
    FaRobot, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserCircle,
    FaCog, FaUser
} from 'react-icons/fa';

function MainLayout() {
    const { user, logOutUser } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('schedule')) return 'Schedule';
        if (path.includes('attendance')) return 'Attendance';
        if (path.includes('notes')) return 'Notes';
        if (path.includes('ai-assistant')) return 'AI Assistant';
        return 'Alloy';
    };

    const navItems = [
        { to: "/app/dashboard", icon: <FaThLarge size={20} />, label: "Dashboard" },
        { to: "/app/schedule", icon: <FaCalendarAlt size={20} />, label: "Schedule" },
        { to: "/app/attendance", icon: <FaRegCalendarCheck size={20} />, label: "Attendance" },
        { to: "/app/notes", icon: <FaStickyNote size={20} />, label: "Notes" },
        { to: "/app/ai-assistant", icon: <FaRobot size={20} />, label: "AI Assistant" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden">

            {/* --- Sidebar --- */}
            <aside
                className={`relative flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-20
                ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
                    <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                        {/* REPLACE THE OLD CSS BOX WITH THIS IMG TAG */}
                        <img src={logo} alt="Alloy Logo" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-2xl font-bold font-serif text-gray-800 dark:text-white whitespace-nowrap">Alloy</span>
                    </div>

                    {!isSidebarOpen && (
                        // Collapsed state logo
                        <img src={logo} alt="Alloy Logo" className="w-8 h-8 rounded-lg object-cover" />
                    )}
                </div>

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-20 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1.5 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white shadow-sm transition-colors z-30"
                >
                    {isSidebarOpen ? <FaChevronLeft size={10} /> : <FaChevronRight size={10} />}
                </button>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `
                                relative group flex items-center px-3 py-3 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'}
                                ${!isSidebarOpen ? 'justify-center' : ''}
                            `}
                        >
                            <span className="relative z-10">{item.icon}</span>
                            <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'opacity-0 w-0 hidden'}`}>
                                {item.label}
                            </span>
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <button
                        onClick={logOutUser}
                        className={`w-full flex items-center px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${!isSidebarOpen ? 'justify-center' : ''}`}
                    >
                        <FaSignOutAlt size={20} />
                        <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'opacity-0 w-0 hidden'}`}>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- Main Content Wrapper --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* Header - FIX: Increased z-index from 40 to 50 */}
                <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-6 sticky top-0 z-50">

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                        {getPageTitle()}
                    </h2>

                    <div className="flex items-center gap-4">

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        {/* --- PROFILE DROPDOWN START --- */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-3 focus:outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-none">{user?.username || 'Student'}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                        <FaUserCircle className="text-gray-400 w-full h-full" />
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileMenuOpen && (
                                <>
                                    {/* Invisible backdrop to close menu when clicking outside - FIX: z-index ensures it catches clicks */}
                                    <div
                                        className="fixed inset-0 z-40 cursor-default"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    ></div>

                                    {/* Menu Card - FIX: Increased z-index from 40 to 50 */}
                                    <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* User Info Header */}
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                            <p className="font-bold text-gray-800 dark:text-white truncate">{user?.username || 'User'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2 space-y-1">
                                            <Link
                                                to="/app/profile"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <FaUser className="text-gray-400" /> My Profile
                                            </Link>
                                        </div>

                                        {/* Logout Section */}
                                        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={() => { logOutUser(); setIsProfileMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <FaSignOutAlt /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* --- PROFILE DROPDOWN END --- */}

                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;