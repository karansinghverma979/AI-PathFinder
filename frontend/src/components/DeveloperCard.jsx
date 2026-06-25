import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode } from 'react-icons/fi';

const avatarStyles = [
    'bottts', 'initials', 'thumbs', 'shapes', 
    'adventurer', 'big-ears', 'micah', 'fun-emoji'
];

const DeveloperCard = ({ candidate }) => {
    const [avatarStyle, setAvatarStyle] = useState(avatarStyles[0]);

    const changeAvatar = () => {
        setAvatarStyle(prevStyle => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * avatarStyles.length);
            } while (avatarStyles[newIndex] === prevStyle);
            return avatarStyles[newIndex];
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
            whileHover={{ scale: 1.02, boxShadow: '0px 10px 30px rgba(99, 102, 241, 0.5)' }}
            className="relative bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-500/50"
        >
            <div className="absolute top-4 right-4">
                <motion.div 
                    className="flex items-center gap-1 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                    whileHover={{ scale: 1.1 }}
                >
                    <FiCode className="animate-pulse" />
                    <span>Dev</span>
                </motion.div>
            </div>
            
            <div className="flex flex-col h-full">
                <div className="text-center">
                    <motion.div
                        className="relative cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        onClick={changeAvatar}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={avatarStyle}
                                src={`https://api.dicebear.com/8.x/${avatarStyle}/svg?seed=${candidate.name}`}
                                alt={candidate.name}
                                className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-slate-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, rotate: [0, 5, 0, -5, 0] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        </AnimatePresence>
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                                boxShadow: '0 0 20px 5px rgba(192, 132, 252, 0)',
                            }}
                            animate={{
                                boxShadow: [
                                    '0 0 20px 5px rgba(192, 132, 252, 0)',
                                    '0 0 20px 10px rgba(192, 132, 252, 0.5)',
                                    '0 0 20px 5px rgba(192, 132, 252, 0)',
                                ],
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                            }}
                        />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white mb-1">{candidate.name}</h2>
                    <p className="text-indigo-300 text-sm mb-4">{candidate.email}</p>
                </div>

                <div className="h-32 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-slate-300 text-sm">
                        <strong className="text-indigo-300">Skills:</strong> {candidate.skills}
                    </p>
                </div>
                
                <div className="mt-auto pt-4 text-center">
                    <p className="text-xs text-slate-500">
                        Last Updated: {new Date(candidate.updated_at).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Animated background shapes */}
            <motion.div
                className="absolute -top-10 -left-10 w-24 h-24 bg-indigo-500/20 rounded-full"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute -bottom-12 -right-8 w-32 h-32 bg-pink-500/10 rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
};


export default DeveloperCard;
