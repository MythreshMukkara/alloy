/**
 * File: client/src/pages/NotesPage.jsx
 * Description: Page to list and edit notes for the current user.
 */
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api.service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
    FaPlus, FaSave, FaTrash, FaRobot, FaPaperclip, 
    FaSearch, FaBookOpen, FaPen
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DocumentManager from '../components/DocumentManager';

function NotesPage() {
    const [subjects, setSubjects] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    
    // --- FIX 1: Add isCreating state ---
    const [isCreating, setIsCreating] = useState(false); 
    
    const [noteContent, setNoteContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAttachments, setShowAttachments] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // --- Data Fetching ---
    const fetchSubjects = useCallback(async () => {
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
            if (response.data.length > 0 && !selectedSubject) {
                setSelectedSubject(response.data[0]);
            }
        } catch (error) { console.error("Error fetching subjects:", error); }
    }, [selectedSubject]);

    useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

    useEffect(() => {
        if (selectedSubject) {
            setIsLoading(true);
            api.get(`/notes/subject/${selectedSubject._id}`)
                .then(response => {
                    setNotes(response.data);
                    // Reset editor if current note doesn't belong to new subject
                    if (selectedNote && selectedNote.subject !== selectedSubject._id) {
                        handleCreateNewNote();
                    }
                })
                .catch(error => console.error("Error fetching notes:", error))
                .finally(() => setIsLoading(false));
        }
    }, [selectedSubject]);

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setIsCreating(false); // Turn off creating mode
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setShowAttachments(false);
    };

    const handleCreateNewNote = () => {
        setSelectedNote(null);
        setIsCreating(true); // --- FIX 2: Turn on creating mode ---
        setNoteTitle('');
        setNoteContent('');
        setShowAttachments(false);
    };

    const handleSaveNote = async () => {
        if (!selectedSubject) return alert("Please select a subject first.");
        if (!noteTitle.trim()) return alert("Note must have a title.");
        
        const noteData = { title: noteTitle, content: noteContent };

        try {
            if (selectedNote && selectedNote._id) {
                const response = await api.put(`/notes/${selectedNote._id}`, noteData);
                setSelectedNote(response.data);
                setNotes(notes.map(n => n._id === selectedNote._id ? response.data : n));
            } else {
                const response = await api.post('/notes', { ...noteData, subjectId: selectedSubject._id });
                setNotes([response.data, ...notes]); 
                setSelectedNote(response.data);
                setIsCreating(false); // Reset creating mode after save
            }
        } catch (error) { console.error("Error saving note:", error); }
    };

    const handleDeleteNote = async (e, noteId) => {
        e.stopPropagation();
        if (window.confirm("Delete this note?")) {
            try {
                await api.delete(`/notes/${noteId}`);
                setNotes(notes.filter(n => n._id !== noteId));
                if (selectedNote?._id === noteId) handleCreateNewNote();
            } catch (error) { console.error("Error deleting note:", error); }
        }
    };

    const handleAddSubject = async () => {
        const name = prompt("Enter new subject name:");
        if (name) {
            try {
                const res = await api.post('/subjects', { name });
                setSubjects([...subjects, res.data]);
                setSelectedSubject(res.data);
            } catch (error) { console.error("Error adding subject:", error); }
        }
    };

    const handleSummarizeWithAI = () => {
        if (!selectedNote || !selectedNote._id) return alert("Please save the note first.");
        navigate('/app/ai-assistant', { state: { context: { type: 'summarize', noteId: selectedNote._id } } });
    };

    return (
        <div className="flex h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* Column 1: Subjects Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
                    <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <FaBookOpen className="text-blue-500"/> Subjects
                    </h2>
                    <button onClick={handleAddSubject} className="p-1.5 bg-white dark:bg-gray-700 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                        <FaPlus size={12} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {subjects.map(sub => (
                        <button
                            key={sub._id}
                            onClick={() => setSelectedSubject(sub)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${selectedSubject?._id === sub._id 
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            {sub.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Column 2: Notes List */}
            <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold text-gray-800 dark:text-white">{selectedSubject?.name || 'Notes'}</h2>
                        <button 
                            onClick={handleCreateNewNote}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <FaPlus /> New
                        </button>
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input 
                            type="text" 
                            placeholder="Search notes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredNotes.length > 0 ? filteredNotes.map(note => (
                        <div 
                            key={note._id} 
                            onClick={() => handleSelectNote(note)}
                            className={`group p-4 border-b border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative
                                ${selectedNote?._id === note._id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                            <h3 className={`font-bold text-sm mb-1 truncate pr-6 ${selectedNote?._id === note._id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                {note.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 h-8 overflow-hidden opacity-80" 
                               dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]+>/g, '') || 'No content...' }} 
                            />
                            <span className="text-[10px] text-gray-400 mt-2 block">
                                {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            
                            <button 
                                onClick={(e) => handleDeleteNote(e, note._id)}
                                className={`absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all
                                    ${selectedNote?._id === note._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            {searchQuery ? 'No notes found' : 'Create your first note'}
                        </div>
                    )}
                </div>
            </div>

            {/* Column 3: Editor Area */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                {/* --- FIX 3: Check isCreating as well --- */}
                {(selectedNote || isCreating) ? (
                    <>
                        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
                            <input
                                type="text"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="Untitled Note"
                                className="text-xl font-bold text-gray-800 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full placeholder-gray-300"
                            />
                            <div className="flex items-center gap-2 ml-4">
                                <button 
                                    onClick={() => setShowAttachments(!showAttachments)}
                                    className={`p-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2
                                        ${showAttachments ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    title="Toggle Attachments"
                                >
                                    <FaPaperclip />
                                </button>
                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                                <button 
                                    onClick={handleSummarizeWithAI}
                                    disabled={!selectedNote?._id}
                                    className="flex items-center gap-2 px-3 py-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaRobot /> AI Summary
                                </button>
                                <button 
                                    onClick={handleSaveNote}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm hover:shadow transition-all text-sm font-bold"
                                >
                                    <FaSave /> Save
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden relative">
                            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
                                <ReactQuill
                                    theme="snow"
                                    value={noteContent}
                                    onChange={setNoteContent}
                                    className="h-full dark:text-gray-200 border-none"
                                    modules={{ toolbar: [[{'header': [1, 2, false]}], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{'list': 'ordered'}, {'list': 'bullet'}], ['link', 'clean']] }}
                                />
                            </div>

                            {showAttachments && selectedSubject && (
                                <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto shadow-inner animate-in slide-in-from-right duration-300">
                                    <DocumentManager subject={selectedSubject} />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <FaPen className="text-3xl opacity-50" />
                        </div>
                        <p className="text-lg font-medium">Select a note to view</p>
                        <p className="text-sm opacity-70">or create a new one to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotesPage;