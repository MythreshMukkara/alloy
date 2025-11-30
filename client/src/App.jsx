/**
 * File: client/src/App.jsx
 * Description: Top-level React component that defines application routes
 * and maps public/protected pages to layouts.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Layouts
import PublicLayout from './components/PublicLayout';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import AboutUsPage from './pages/AboutUsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';

// Protected Pages
import SchedulePage from './pages/SchedulePage';
import AttendancePage from './pages/AttendancePage';
import NotesPage from './pages/NotesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      {/* This handles the Landing Page, Login, Register, and About Us */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={null} /> {/* Renders Landing Page content */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Standalone public routes for password reset */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* --- Protected Application Routes --- */}
      {/* FIX: Changed path to "/app" to match MainLayout links and avoid collision */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* FIX: Redirect index to /app/dashboard */}
          <Route index element={<Navigate to="/app/dashboard" replace />} />

          {/* These become /app/dashboard, /app/schedule, etc. */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<div style={{ padding: 20, textAlign: 'center', color: 'white' }}>Page not found</div>} />
    </Routes>
  )
}

export default App;