/**
 * File: client/src/components/DocumentManager.jsx
 * Description: Component to upload, list, and delete user documents.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api.service';
import { FaTrash, FaFilePdf, FaFileImage, FaFileWord, FaRegFileAlt, FaFilePowerpoint, FaPlus } from 'react-icons/fa';

const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500 text-xl" />;
    if (fileType.includes('image')) return <FaFileImage className="text-purple-500 text-xl" />;
    if (fileType.includes('word')) return <FaFileWord className="text-blue-500 text-xl" />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <FaFilePowerpoint className="text-orange-500 text-xl" />;
    return <FaRegFileAlt className="text-gray-500 text-xl" />;
};

function DocumentManager({ subject }) {
    const [documents, setDocuments] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (subject) {
            api.get(`/documents/subject/${subject._id}`)
                .then(res => setDocuments(res.data));
        }
    }, [subject]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile || !subject) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('subjectId', subject._id);

        try {
            const response = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDocuments([...documents, response.data]);
            setSelectedFile(null);
        } catch (error) { console.error("Error uploading file:", error); } 
        finally { setIsUploading(false); }
    };

    const handleDelete = async (docId) => {
        if (window.confirm("Delete this document?")) {
            await api.delete(`/documents/${docId}`);
            setDocuments(documents.filter(doc => doc._id !== docId));
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Attachments</h3>

            <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <label
                    htmlFor="input-file-upload"
                    className={`relative flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
                        ${dragActive 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                            : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                    <FaPlus className="text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Drop file or <span className="font-semibold text-blue-500">browse</span></p>
                    <input id="input-file-upload" type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0" />
                </label>
                {dragActive && <div className="absolute inset-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            </form>

            {selectedFile && (
                <div className="mt-3 flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 truncate max-w-[120px]">{selectedFile.name}</p>
                    <button 
                        onClick={handleUpload} 
                        disabled={isUploading} 
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isUploading ? '...' : 'Upload'}
                    </button>
                </div>
            )}

            <div className="mt-6 space-y-2">
                {documents.length > 0 ? documents.map(doc => (
                    <div key={doc._id} className="group flex items-center justify-between p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-gray-600 transition-colors shadow-sm">
                        <a href={`http://localhost:3232/${doc.filePath.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 min-w-0">
                            {getFileIcon(doc.fileType)}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate hover:text-blue-600 dark:hover:text-blue-400">{doc.fileName}</span>
                        </a>
                        <button onClick={() => handleDelete(doc._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            <FaTrash size={12} />
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-gray-400 text-xs py-4">No attachments yet.</p>
                )}
            </div>
        </div>
    );
}

export default DocumentManager;