import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiUsers, FiCoffee, FiAward } from 'react-icons/fi';
import AboutDeveloperCard from './AboutDeveloperCard';

const API = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";

const AboutTab = () => {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const response = await axios.get(`${API}/candidates`);
                const devs = response.data.filter(c => c.is_developer);
                
                // Assign roles to developers
                devs.forEach(dev => {
                    if (dev.name === "Karan Singh Verma") {
                        dev.role = "Full Stack Developer";
                    } else if (dev.name === "Ankit Kushwaha") {
                        dev.role = "Backend Designer";
                    } else if (dev.name === "Akarshan Gupta") {
                        dev.role = "UI Frontend Design";
                    } else {
                        dev.role = "Developer";
                    }
                });

                setDevelopers(devs);
            } catch (error) {
                console.error("Failed to fetch developers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDevelopers();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="relative text-white p-4 md:p-8 min-h-[80vh] overflow-hidden">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.2 } }
                }}
                className="relative z-10 space-y-24"
            >
                {/* Header Section */}
                <motion.div 
                    className="text-center"
                    variants={{ hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                        The Genesis of AI PathFinder
                    </h2>
                    <p className="mt-4 text-slate-300 max-w-3xl mx-auto text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                        A fusion of code and ambition, AI PathFinder is a testament to the power of developer collaboration. This project harnesses AI to illuminate career paths and empower professional growth.
                    </p>
                    <p className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 text-xl font-black tracking-widest flex items-center justify-center gap-3 uppercase" style={{ fontFamily: "'Sora', sans-serif" }}>
                        <FiAward className="text-pink-500 text-2xl animate-pulse" />
                        A Product of Raw Dedication & Self-Taught Craftsmanship.
                    </p>
                </motion.div>

                {/* Developers Section */}
                <motion.div 
                    variants={{
                        visible: { transition: { staggerChildren: 0.3 } }
                    }}
                >
                    <h3 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3 text-slate-200" style={{ fontFamily: "'Sora', sans-serif" }}>
                        <FiUsers /> Meet the Architects
                    </h3>
                    
                    {/* Primary Developer: Karan Singh Verma (Centered) */}
                    <div className="flex justify-center mb-16 px-4">
                        {developers.filter(dev => dev.name === "Karan Singh Verma").map((dev, index) => (
                            <motion.div 
                                key={dev.id} 
                                className="w-full max-w-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <AboutDeveloperCard developer={dev} index={index} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Other Developers (Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto px-4">
                        {developers.filter(dev => dev.name !== "Karan Singh Verma").map((dev, index) => (
                            <motion.div 
                                key={dev.id}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <AboutDeveloperCard developer={dev} index={index + 1} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Donation Section - Refactored to "Open" layout */}
                <motion.div 
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center pb-12"
                >
                    <div className="text-center relative max-w-2xl px-4">
                        <div className="absolute -inset-10 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
                        <FiCoffee className="mx-auto text-purple-400 text-5xl mb-6 animate-bounce" />
                        <h3 className="text-4xl font-extrabold mb-4 text-white tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Fuel Our Mission
                        </h3>
                        <p className="text-slate-300 mb-8 text-lg leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                            If our work has inspired you, consider supporting our journey. Every contribution fuels future innovation and helps us maintain this platform for the developer community.
                        </p>
                        <div className="inline-flex flex-col items-center">
                            <span className="text-slate-500 text-sm uppercase tracking-[0.2em] mb-3">Support via UPI / Crypto</span>
                            <div className="bg-slate-800/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-slate-700/50 shadow-inner group hover:border-purple-500/50 transition-all duration-300">
                                <p className="font-mono text-2xl text-purple-300 tracking-wider group-hover:text-purple-200 transition-colors">forcoffee@developer.webapp</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AboutTab;

