/**
 * File: client/src/components/ProtectedRoute.jsx
 * Description: Route guard that checks authentication and redirects to login
 * if the user is not authenticated.
 */
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Import Outlet if you use it inside, otherwise ignore
import { AuthContext } from '../context/auth.context';

function ProtectedRoute({ children }) {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    // 1. Wait for the auth check to finish
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // 2. If finished and not logged in, redirect
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 3. If logged in, render the child components (the layout)
    // If you used <Route element={<MainLayout />}> structure in App.jsx, 
    // children might be undefined here if ProtectedRoute wraps an Outlet directly. 
    // Usually, it wraps the Outlet or returns children.
    return children ? children : <Outlet />;
}

export default ProtectedRoute;
