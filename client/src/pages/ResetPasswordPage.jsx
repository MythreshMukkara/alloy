import React, { useState } from 'react';
/**
 * File: client/src/pages/ResetPasswordPage.jsx
 * Description: Page for resetting a user's password using a token.
 */
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.service';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams(); // Gets the token from the URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.post('/auth/reset-password', { token, password });
            setMessage(response.data.message + " Redirecting to login...");
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Set your new password
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="New Password" />

                    {message && <p className="text-sm text-green-600">{message}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;