/**
 * File: client/src/pages/ProfilePage.jsx
 * Description: User profile page for viewing and editing account info.
 */
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import api from '../services/api.service';
import { FaUser, FaLock, FaTrash } from 'react-icons/fa';

function ProfilePage() {
    const { user, logOutUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        username: user?.username || '', 
        email: user?.email || '' 
    });
    
    // Password state
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            // Backend endpoint required: PUT /api/auth/update
            await api.put('/auth/update', { username: formData.username });
            alert("Profile updated.");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return alert("Passwords do not match");
        try {
            // Backend endpoint required: PUT /api/auth/change-password
            await api.put('/auth/change-password', { 
                currentPassword: passwords.current, 
                newPassword: passwords.new 
            });
            alert("Password changed.");
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error(error);
            alert("Failed to change password.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>

            {/* Public Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl">
                        <FaUser />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user?.username}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        {isEditing ? (
                            <>
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium">Edit Profile</button>
                        )}
                    </div>
                </form>
            </div>

            {/* Security Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><FaLock /> Security</h3>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                        <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                            <input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                            <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-800">Update Password</button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2"><FaTrash /> Danger Zone</h3>
                <p className="text-sm text-red-600 dark:text-red-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Delete Account</button>
            </div>
        </div>
    );
}

export default ProfilePage;