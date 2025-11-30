/**
 * File: client/src/components/Modal.jsx
 * Description: Reusable modal component used across the client app.
 */

import React from 'react';
import { FaTimes } from 'react-icons/fa';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        // Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
            {/* Modal Container */}
            <div 
                className="bg-white dark:bg-gray-800 w-full max-w-md mx-4 rounded-2xl shadow-2xl transform transition-all scale-100 border border-gray-100 dark:border-gray-700"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
                        aria-label="Close modal"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;