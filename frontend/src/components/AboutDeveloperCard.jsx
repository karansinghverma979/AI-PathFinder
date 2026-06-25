import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiCode, FiPhone } from 'react-icons/fi';
import ContactDetailsDialog from './ContactDetailsDialog';

const avatarStyles = [
    'bottts', 'initials', 'thumbs', 'shapes', 
    'adventurer', 'big-ears', 'micah', 'fun-emoji'
];

const AboutDeveloperCard = ({ developer, index }) => {
    const [avatarStyle, setAvatarStyle] = useState(avatarStyles[0]);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Specific Info for Karan Singh Verma
    const isKaran = developer.name === "Karan Singh Verma";
    const contactInfoData = isKaran ? {
        mobile: "8718990696",
        email: "karansinghverma979@gmail.com",
        github: "https://github.com/karansinghverma979/",
        linkedin: "https://www.linkedin.com/in/karansinghverma979/"
    } : {
        mobile: developer.mobile || "",
        email: developer.email || "",
        github: developer.github || "#",
        linkedin: developer.linkedin || "#"
    };

    const changeAvatar = () => {
        setAvatarStyle(prevStyle => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * avatarStyles.length);
            } while (avatarStyles[newIndex] === prevStyle);
            return avatarStyles[newIndex];
        });
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: index * 0.3,
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const handleEmailClick = (e) => {
        e.preventDefault();
        setIsContactModalOpen(true);
    };

    const dialogContactInfo = [
        { label: "Email Address", value: contactInfoData.email, icon: <FiMail /> },
        { label: "Github Profile", value: contactInfoData.github, icon: <FiGithub /> },
        { label: "LinkedIn Profile", value: contactInfoData.linkedin, icon: <FiLinkedin /> },
    ];

    if (contactInfoData.mobile) {
        dialogContactInfo.unshift({ label: "Mobile Number", value: contactInfoData.mobile, icon: <FiPhone /> });
    }

    return (
        <>
            <motion.div
                variants={cardVariants}
                className="relative group w-full"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                <div className="relative p-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col h-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] group-hover:border-purple-500/30 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <motion.div
                            className="relative cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            onClick={changeAvatar}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={avatarStyle}
                                    src={`https://api.dicebear.com/8.x/${avatarStyle}/svg?seed=${developer.name}`}
                                    alt={developer.name}
                                    className="w-24 h-24 rounded-2xl border-2 border-white/10 shadow-2xl bg-slate-800"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                    transition={{ type: "spring", damping: 15 }}
                                />
                            </AnimatePresence>
                            <motion.div
                                className="absolute -bottom-2 -right-2 bg-purple-500 p-1.5 rounded-lg shadow-lg"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FiCode className="text-white text-xs" />
                            </motion.div>
                        </motion.div>
                        <div className="text-right">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold block mb-1">Architecture</span>
                            <div className="flex items-center gap-1.5 justify-end text-purple-400">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-widest">Lead Dev</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-white mb-1 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{developer.name}</h4>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black mb-4 text-xl tracking-wide uppercase italic" style={{ fontFamily: "'Inter', sans-serif" }}>{developer.role}</p>
                    </div>
                    <p className="text-slate-400 text-base mb-8 flex-grow leading-relaxed font-medium">{developer.contributions || "Spearheading the technical evolution of AI PathFinder with a focus on high-performance architecture and immersive UI."}</p>
                    
                    {contactInfoData.mobile && (
                        <div className="mb-6 flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                            <FiPhone className="text-pink-500" />
                            <span className="text-sm font-bold text-slate-300">{contactInfoData.mobile}</span>
                        </div>
                    )}

                    <div className="mb-8">
                        <h5 className="font-black text-slate-600 mb-4 text-[10px] uppercase tracking-[0.3em]">Technical Stack</h5>
                        <div className="flex flex-wrap gap-2.5">
                            {(developer.skills || "").split(',').map(skill => (
                                <motion.span 
                                    key={skill} 
                                    className="bg-white/5 text-slate-300 text-[11px] font-bold px-4 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm"
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#fff' }}
                                >
                                    {skill.trim()}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-center gap-10 text-slate-500">
                        <motion.a 
                            href={contactInfoData.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-white transition-all duration-300"
                            whileHover={{ y: -5, scale: 1.2, color: "#fff" }}
                        >
                            <FiGithub size={26} title={contactInfoData.github} />
                        </motion.a>
                        <motion.a 
                            href={contactInfoData.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-[#0077b5] transition-all duration-300"
                            whileHover={{ y: -5, scale: 1.2, color: "#0077b5" }}
                        >
                            <FiLinkedin size={26} title={contactInfoData.linkedin} />
                        </motion.a>
                        <motion.button 
                            onClick={handleEmailClick}
                            className="hover:text-pink-500 transition-all duration-300 cursor-pointer"
                            whileHover={{ y: -5, scale: 1.2, color: "#ec4899" }}
                        >
                            <FiMail size={26} title={contactInfoData.email} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <ContactDetailsDialog 
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title="Connect with Architect"
                contactInfo={dialogContactInfo}
            />
        </>
    );
};

export default AboutDeveloperCard;
