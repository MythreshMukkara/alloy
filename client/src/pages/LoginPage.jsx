/**
 * File: client/src/pages/LoginPage.jsx
 * Description: User login page.
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import api from '../services/api.service';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { storeToken, authenticateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            storeToken(response.data.authToken);
            await authenticateUser();
            navigate('/app/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Sign In failed.');
        }
    };

    return (
        <div className="w-full space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="name@example.com"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                    />
                </div>

                {error && <div className="p-3 rounded bg-red-900/30 border border-red-800 text-red-300 text-sm">{error}</div>}

                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
                >
                    Sign In
                </button>
            </form>

            <div className="text-center">
                <Link to="/forgot-password" className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors">
                    Forgot your password?
                </Link>
            </div>
        </div>
    );
}

export default LoginPage;