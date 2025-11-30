/**
 * File: client/src/pages/AboutUsPage.jsx
 * Description: Static about page describing the application.
 */

import React from 'react';

function AboutUsPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-white mb-6">About <span className="text-blue-500">Alloy</span></h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    We are building the future of student productivity. Alloy isn't just a tool; it's your academic operating system designed to help you focus on what matters: learning.
                </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
                    <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        The modern student is overwhelmed by scattered tools—one app for notes, another for calendar, and yet another for tasks.
                    </p>
                    <p className="text-gray-400 leading-relaxed">
                        Our mission is to forge these disparate elements into a single, strong alloy. We aim to reduce cognitive load so you can achieve academic excellence without the burnout.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold text-xl border border-blue-500/30">1</div>
                        <div className="ml-6">
                            <h3 className="text-xl font-bold text-white">Centralization</h3>
                            <p className="text-gray-400 mt-2">Bring your schedule, attendance, and study materials into one unified dashboard.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 font-bold text-xl border border-purple-500/30">2</div>
                        <div className="ml-6">
                            <h3 className="text-xl font-bold text-white">Intelligence</h3>
                            <p className="text-gray-400 mt-2">Use AI to summarize lectures and generate personalized study plans automatically.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center text-green-400 font-bold text-xl border border-green-500/30">3</div>
                        <div className="ml-6">
                            <h3 className="text-xl font-bold text-white">Tracking</h3>
                            <p className="text-gray-400 mt-2">Visualize your progress in attendance and coding challenges to stay motivated.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUsPage;