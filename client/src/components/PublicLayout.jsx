/**
 * File: client/src/components/PublicLayout.jsx
 * Description: Layout wrapper for public-facing routes (login/register/about).
 */
import logo from '../assets/logo.png';
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { FaBars, FaTimes, FaCalendarAlt, FaTasks, FaBook, FaRobot, FaGithub } from 'react-icons/fa';

function PublicLayout() {
    const [showLogin, setShowLogin] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if we are exactly on the home page
    const isHomePage = location.pathname === '/';

    // Determine if we need to center the content (for Forgot Password, Reset Password)
    // We exclude '/about' because it will have its own layout
    const isCenteredContentPage = !isHomePage && location.pathname !== '/about';

    // Handler to switch auth mode and ensure we are on the home page
    const handleAuthNavigation = (loginMode) => {
        setShowLogin(loginMode);
        setIsMobileMenuOpen(false);
        if (!isHomePage) {
            navigate('/');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
            {/* --- Navigation Bar --- */}
            <header className="bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-xl border-b border-gray-700">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <NavLink to="/" className="flex items-center flex-shrink-0 group">
                            <img src={logo} alt="Alloy Logo" className="h-8 w-8 mr-2 group-hover:animate-spin-slow transition-transform" />
                            <span className="font-bold text-3xl text-blue-500 font-serif tracking-tight group-hover:text-blue-400 transition-colors">Alloy</span>
                        </NavLink>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors duration-200 ${isActive && isHomePage ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
                                Home
                            </NavLink>
                            <NavLink to="/about" className={({ isActive }) => `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
                                About Us
                            </NavLink>

                            {/* Auth Buttons */}
                            <div className="flex items-center space-x-4 ml-4">
                                <button
                                    onClick={() => handleAuthNavigation(true)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${showLogin && isHomePage ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'}`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => handleAuthNavigation(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-105 ${!showLogin && isHomePage ? 'bg-blue-700 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : 'bg-blue-600 hover:bg-blue-500'}`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none">
                                {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-gray-900 border-t border-gray-700 absolute w-full left-0">
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Home</NavLink>
                            <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">About Us</NavLink>
                            <div className="border-t border-gray-700 my-2 pt-2 space-y-2">
                                <button onClick={() => handleAuthNavigation(true)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Log In</button>
                                <button onClick={() => handleAuthNavigation(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700">Sign Up</button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* --- Main Content Area --- */}
            <main className="flex-grow flex flex-col">
                {isHomePage ? (
                    // === HOME PAGE LAYOUT (Matches your Sketch) ===
                    <>
                        {/* 1. Split Section: Welcome & Auth */}
                        <section className="flex-grow flex flex-col justify-center py-12 md:py-20 px-4 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                            <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-20 z-10">

                                {/* Left: Welcome Content */}
                                <div className="w-full lg:w-3/5 flex flex-col justify-center text-center lg:text-left space-y-5">
                                    <h1 className="text-7xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">
                                        Welcome to Alloy
                                    </h1>
                                    <p className="text-xl lg:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                        Your integrated academic command center. <br className="hidden lg:block" />
                                        Master your schedule, track your growth, and amplify your learning with AI.
                                    </p>
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
                                        <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-blue-300 border border-gray-700 flex items-center gap-2"><FaCalendarAlt /> Smart Scheduling</span>
                                        <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-green-300 border border-gray-700 flex items-center gap-2"><FaTasks /> Task Management</span>
                                        <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-purple-300 border border-gray-700 flex items-center gap-2"><FaRobot /> AI Assistant</span>
                                    </div>
                                </div>

                                {/* Right: Auth Box */}
                                <div className="w-full max-w-md lg:w-2/5 flex flex-col">
                                    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl flex-grow flex flex-col">
                                        <div className="mb-8 text-center">
                                            <h2 className="text-3xl font-bold text-white mb-2">
                                                {showLogin ? "Welcome Back" : "Join Alloy"}
                                            </h2>
                                            <p className="text-gray-400 text-sm">
                                                {showLogin ? "Enter your details to access your workspace." : "Start your organized academic journey today."}
                                            </p>
                                        </div>

                                        {/* Render the appropriate form */}
                                        {showLogin ? <LoginPage /> : <RegisterPage />}

                                        {/* Toggle Link */}
                                        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                                            <p className="text-sm text-gray-400">
                                                {showLogin ? "New to Alloy? " : "Already have an account? "}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowLogin(!showLogin)}
                                                    className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-all focus:outline-none ml-1"
                                                >
                                                    {showLogin ? "Create an account" : "Log in"}
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Site Information (Features) */}
                        <section id="features" className="py-20 px-4 bg-gray-900/50 border-t border-gray-800">
                            <div className="max-w-7xl mx-auto">
                                <div className="text-center mb-16">
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything in One Place</h2>
                                    <p className="text-gray-400 max-w-2xl mx-auto">Stop switching between five different apps. Alloy brings your academic life together.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        { icon: <FaCalendarAlt />, title: "Timetable", desc: "Visual weekly schedule management.", color: "text-blue-400" },
                                        { icon: <FaTasks />, title: "Tasks", desc: "Track assignments and deadlines.", color: "text-green-400" },
                                        { icon: <FaBook />, title: "Notes", desc: "Rich text notes linked to subjects.", color: "text-yellow-400" },
                                        { icon: <FaRobot />, title: "AI Assistant", desc: "Get summaries and study plans.", color: "text-purple-400" }
                                    ].map((feature, idx) => (
                                        <div key={idx} className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:-translate-y-1 group">
                                            <div className={`text-4xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>{feature.icon}</div>
                                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    // === OTHER PAGES LAYOUT (About, Forgot Password) ===
                    <div className={`flex-grow flex flex-col ${isCenteredContentPage ? 'justify-center items-center py-12 px-4' : ''}`}>
                        <div className={`w-full ${isCenteredContentPage ? 'max-w-md' : ''}`}>
                            <Outlet />
                        </div>
                    </div>
                )}
            </main>

            {/* --- Footer --- */}
            <footer className="bg-gray-900 border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <span className="text-2xl font-bold text-gray-700 font-serif mr-2">Alloy</span>
                        <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-400">
                        <a href="https://github.com/MythreshMukkara/alloy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <FaGithub size={20} />
                        </a>
                        <NavLink to="/privacy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</NavLink>
                        <NavLink to="/contact" className="hover:text-white cursor-pointer transition-colors">Contact</NavLink>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default PublicLayout;