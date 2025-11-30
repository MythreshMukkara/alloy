/**
 * File: client/src/pages/ForgotPasswordPage.jsx
 * Description: Page to request a password reset email.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.service';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Email address" />
                    
                    {message && <p className="text-sm text-green-600">{message}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Send Reset Link
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;