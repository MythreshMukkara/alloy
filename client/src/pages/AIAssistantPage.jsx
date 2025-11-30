/**
 * File: client/src/pages/AIAssistantPage.jsx
 * Description: Page that interfaces with the AI assistant for chat and tools.
 */
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api.service';
import ReactMarkdown from 'react-markdown';
import { 
    FaPlus, FaTrash, FaPaperPlane, FaRobot, FaUser, 
    FaChevronLeft, FaChevronRight, FaHistory 
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

function AIAssistantPage() {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for collapsible sidebar
    
    const location = useLocation();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const contextProcessed = useRef(false); // Flag to prevent double-fetch on navigation

    // --- Data Fetching ---
    useEffect(() => {
        fetchConversations();
        
        // Handle Context from other pages (e.g. "Summarize Note")
        const context = location.state?.context;
        if (context && !contextProcessed.current) {
            contextProcessed.current = true;
            navigate(location.pathname, { replace: true });
            handleSendMessage(null, context);
        }
    }, [location.state]);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversation?.history, isLoading]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/ai/conversations');
            setConversations(res.data);
        } catch (err) { console.error("Error fetching conversations:", err); }
    };

    // --- Handlers ---
    const handleSelectConversation = async (convoId) => {
        try {
            const res = await api.get(`/ai/conversations/${convoId}`);
            setCurrentConversation(res.data);
            // On mobile, auto-close sidebar when a chat is selected
            if (window.innerWidth < 768) setIsSidebarOpen(false);
        } catch (err) { console.error("Error fetching chat:", err); }
    };

    const handleNewChat = () => {
        setCurrentConversation(null);
    };
    
    const handleDeleteConversation = async (e, convoId) => {
        e.stopPropagation();
        if (window.confirm("Delete this conversation?")) {
            try {
                await api.delete(`/ai/conversations/${convoId}`);
                setConversations(conversations.filter(c => c._id !== convoId));
                if (currentConversation?._id === convoId) setCurrentConversation(null);
            } catch (err) { console.error("Error deleting chat:", err); }
        }
    };

    const handleSendMessage = async (e, initialContext = null) => {
        if (e) e.preventDefault();

        // Construct the user message
        let userMessage;
        if (initialContext) {
            switch (initialContext.type) {
                case 'summarize': userMessage = "Can you summarize this note for me?"; break;
                case 'create_study_plan': userMessage = "My attendance is low. Can you help me create a study plan?"; break;
                default: userMessage = "Processing request...";
            }
        } else {
            userMessage = userInput.trim();
        }

        if (!userMessage) return;
        
        setIsLoading(true);
        const conversationIdBeforeSend = currentConversation?._id;

        // Optimistic UI Update
        const optimisticallyUpdatedHistory = [...(currentConversation?.history || []), { role: 'user', parts: [{ text: userMessage }] }];
        setCurrentConversation(prev => ({ ...prev, history: optimisticallyUpdatedHistory }));
        setUserInput('');
        
        try {
            const res = await api.post('/ai/chat', {
                message: userMessage,
                conversationId: conversationIdBeforeSend,
                context: initialContext,
            });

            setCurrentConversation(prev => ({
                ...prev,
                _id: res.data.conversationId,
                history: [...optimisticallyUpdatedHistory, { role: 'model', parts: [{ text: res.data.reply }] }]
            }));

            if (!conversationIdBeforeSend) fetchConversations();
        } catch (err) {
            console.error("Error sending message:", err);
            setCurrentConversation(prev => ({...prev, history: prev.history.slice(0, -1)})); // Rollback
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            
            {/* 1. Sidebar (Collapsible) */}
            <div 
                className={`flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out absolute z-20 h-full md:static
                ${isSidebarOpen ? 'w-65 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 opacity-0 md:opacity-100'}`}
                style={{ overflow: isSidebarOpen ? 'visible' : 'hidden' }}
            >

                <div className="p-3">
                    <button 
                        onClick={handleNewChat} 
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                    >
                        <FaPlus size={12} /> New Conversation
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <FaHistory className="text-purple-500"/> History
                    </h2>
                    {/* Collapse Button (Mobile/Desktop inside sidebar) */}
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <FaChevronLeft />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {conversations.map(convo => (
                        <div key={convo._id} 
                            onClick={() => handleSelectConversation(convo._id)}
                            className={`group p-3 rounded-lg cursor-pointer text-sm font-medium flex justify-between items-center transition-all
                                ${currentConversation?._id === convo._id 
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                        >
                            <span className="truncate flex-1 pr-2">{convo.title}</span>
                            <button 
                                onClick={(e) => handleDeleteConversation(e, convo._id)} 
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative w-full">
                
                {/* Header */}
                <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between bg-white dark:bg-gray-900 z-10">
                    <div className="flex items-center gap-3">
                        {/* Sidebar Toggle Button */}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className={`p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isSidebarOpen ? 'hidden md:hidden' : 'block'}`}
                            title="Show History"
                        >
                            <FaChevronRight />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <FaRobot />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white text-sm">Alloy AI</h3>
                                <span className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-white dark:bg-gray-900 custom-scrollbar">
                    {!currentConversation ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/10 rounded-full flex items-center justify-center mb-6">
                                <FaRobot className="text-4xl text-purple-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">How can I help you today?</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                                I can summarize your notes, help you plan your study schedule, or answer questions about your subjects.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                            {currentConversation.history.map((turn, index) => (
                                <div key={index} className={`flex gap-4 ${turn.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 
                                        ${turn.role === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'}`}>
                                        {turn.role === 'user' ? <FaUser size={12} /> : <FaRobot size={14} />}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                                        ${turn.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700'}`}>
                                        <div className="prose dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 text-sm">
                                            <ReactMarkdown>{turn.parts[0].text}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-1 text-purple-600">
                                        <FaRobot size={14} />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-3xl mx-auto relative">
                        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500 transition-all shadow-sm">
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
                                placeholder="Ask anything..."
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 resize-none py-3 px-2 max-h-32 custom-scrollbar text-sm"
                                rows={1}
                                style={{ minHeight: '44px' }}
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={!userInput.trim() || isLoading}
                                className="mb-1 p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </form>
                        <p className="text-center text-xs text-gray-400 mt-2">
                            AI can make mistakes. Check important info.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AIAssistantPage;