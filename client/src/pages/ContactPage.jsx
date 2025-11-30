import React from 'react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function ContactPage() {

    return (
        <div className="max-w-20xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center text-white mb-12">Get in Touch</h1>

            <div className="grid md:grid-cols-1">
                {/* Contact Information */}
                <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                    <p className="text-gray-400 mb-8">Have questions about Alloy? Need support or want to provide feedback? We're here to help.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400">
                                <FaEnvelope />
                            </div>
                            <span>alloystudyhub03@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400">
                                <FaMapMarkerAlt />
                            </div>
                            <span>JNTUACEA, Anantapur</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;