import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight, FiClock, FiWifi, FiWifiOff, FiGithub, FiExternalLink, FiVideo } from 'react-icons/fi';

const API = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";

const LearningTab = () => {
    const [learningPrompt, setLearningPrompt] = useState("");
    const [learningResult, setLearningResult] = useState(null);
    const [learningLoading, setLearningLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [preLoadedPaths, setPreLoadedPaths] = useState([]);

    const checkConnectivity = async () => {
        try {
            // Ping a reliable external resource or your own backend
            await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
            setIsOnline(true);
        } catch (e) {
            setIsOnline(false);
        }
    };

    useEffect(() => {
        const handleStatusChange = () => {
            if (navigator.onLine) {
                checkConnectivity();
            } else {
                setIsOnline(false);
            }
        };

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        // Initial check
        handleStatusChange();

        // Periodic check every 10 seconds for more reliability
        const interval = setInterval(checkConnectivity, 10000);

        // Simulated pre-loaded paths for offline use
        setPreLoadedPaths([
            { title: "React Basics", category: "Frontend" },
            { title: "Python for Beginners", category: "Backend" },
            { title: "Data Analysis with SQL", category: "Data" }
        ]);

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
            clearInterval(interval);
        };
    }, []);

    const generateLearning = async (customPrompt = null) => {
        const promptToUse = customPrompt || learningPrompt;
        if (!promptToUse.trim()) return;

        setLearningLoading(true);
        setError(null);
        setLearningResult(null);
        try {
            const res = await axios.post(`${API}/learning`, { prompt: promptToUse });
            setLearningResult(res.data);
            if (customPrompt) setLearningPrompt(customPrompt);
        } catch (e) {
            console.error(e);
            setError("Connectivity issue: Unable to reach the AI engine. Please check your connection.");
        } finally {
            setLearningLoading(false);
        }
    };

    const offlineContent = (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center bg-slate-900/30"
        >
            <div className="relative inline-block mb-6">
                <FiWifiOff className="text-6xl text-slate-700" />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-4 border-slate-900"
                ></motion.div>
            </div>
            <h3 className="text-2xl font-black text-slate-300 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Deep Offline Mode</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">AI generation is paused, but your growth isn't. Access these core roadmaps even without a connection.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {preLoadedPaths.map((p, i) => (
                    <button 
                        key={i}
                        onClick={() => generateLearning(p.title)}
                        className="p-4 bg-slate-800/40 border border-white/5 rounded-2xl hover:border-purple-500/50 transition-all group text-left"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-1">{p.category}</span>
                        <span className="text-sm font-bold text-slate-200 group-hover:text-white">{p.title}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black flex items-center gap-3 text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        <FiBookOpen className="text-purple-500" /> Learning Forge
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Architect your mastery with AI-driven roadmaps.</p>
                </div>
                <motion.div 
                    className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${isOnline ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    {isOnline ? <FiWifi className="text-lg" /> : <FiWifiOff className="text-lg" />}
                    <span className="text-xs font-black uppercase tracking-widest">{isOnline ? 'System Online' : 'Offline Access'}</span>
                </motion.div>
            </div>
            
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col sm:flex-row gap-3">
                    <input
                        value={learningPrompt}
                        onChange={(e) => setLearningPrompt(e.target.value)}
                        className="flex-grow bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                        placeholder="What do you want to master today?"
                        onKeyPress={(e) => e.key === 'Enter' && generateLearning()}
                    />
                    <button
                        onClick={() => generateLearning()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                        disabled={learningLoading || (!isOnline && !learningPrompt)}
                    >
                        {learningLoading ? "Forging..." : "Generate"}
                        {!learningLoading && <FiArrowRight />}
                    </button>
                </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mt-6 flex items-center gap-3 font-medium text-sm"
                >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                    {error}
                </motion.div>
            )}

            {!isOnline && !learningResult && offlineContent}

            {learningResult && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mt-12 space-y-8"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-6 gap-4">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black block mb-2">Mastery Roadmap</span>
                            <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{learningResult.prompt}</h3>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
                            <FiClock className="text-purple-400" />
                            <span className="text-sm font-bold text-slate-300">{learningResult.estimated_duration}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {learningResult.path.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1, type: "spring" }}
                                className="group relative"
                            >
                                <div className="absolute top-0 left-6 bottom-0 w-px bg-gradient-to-b from-purple-500/50 to-transparent -z-10 group-last:hidden"></div>
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-900 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black shadow-lg group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-grow p-6 bg-slate-900/40 border border-white/5 rounded-3xl group-hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-xl font-bold text-white">{step.title}</h4>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                                                step.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                                step.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-red-500/10 text-red-400'
                                            }`}>
                                                {step.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 leading-relaxed mb-6 font-medium">{step.description}</p>
                                        
                                        {step.resources && (
                                            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                                                {step.resources.tutorials?.[0] && (
                                                    <a href={step.resources.tutorials[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors bg-sky-400/5 px-3 py-2 rounded-xl border border-sky-400/10">
                                                        <FiExternalLink /> DOCS
                                                    </a>
                                                )}
                                                {step.resources.github_projects?.[0] && (
                                                    <a href={step.resources.github_projects[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                                                        <FiGithub /> REPO
                                                    </a>
                                                )}
                                                {step.resources.videos?.[0] && (
                                                    <a href={step.resources.videos[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors bg-pink-400/5 px-3 py-2 rounded-xl border border-pink-400/10">
                                                        <FiVideo /> VIDEO
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LearningTab;
