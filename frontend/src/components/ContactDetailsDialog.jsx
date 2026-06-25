import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiCheck, FiMail, FiPhone, FiGithub, FiLinkedin, FiInfo } from 'react-icons/fi';

const ContactDetailsDialog = ({ isOpen, onClose, title, contactInfo }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[100]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-600/20 blur-3xl rounded-full"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  <FiInfo className="text-purple-500" /> {title}
                </h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="group">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black block mb-2 ml-1">{item.label}</span>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group-hover:border-purple-500/30 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                          {item.icon}
                        </div>
                        <span className="text-sm font-bold text-slate-200 truncate">{item.value}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.value, index)}
                        className={`p-2 rounded-xl transition-all ${
                          copiedIndex === index 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? <FiCheck size={16} /> : <FiCopy size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all border border-white/5 text-sm uppercase tracking-widest"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactDetailsDialog;
