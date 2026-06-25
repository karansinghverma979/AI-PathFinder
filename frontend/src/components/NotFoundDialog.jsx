import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const NotFoundDialog = ({ isOpen, onClose, title, message, suggestions }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-yellow-400/20 rounded-full mb-4">
                <FiAlertTriangle className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-slate-400 mb-4">{message}</p>

              {suggestions && (
                <div className="bg-slate-700/50 p-3 rounded-lg w-full text-left mb-6">
                    <p className="text-sm font-bold mb-2 text-slate-300">Suggestions:</p>
                    <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
              )}

              <button
                onClick={onClose}
                className="secondary-btn flex items-center gap-2"
              >
                <FiX /> Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotFoundDialog;
