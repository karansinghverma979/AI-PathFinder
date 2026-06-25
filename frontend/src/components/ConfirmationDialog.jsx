import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
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
              <div className="p-3 bg-blue-400/20 rounded-full mb-4">
                <FiAlertTriangle className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-slate-400 mb-6">{message}</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={onConfirm}
                  className="primary-btn flex-1 flex items-center justify-center gap-2"
                >
                  <FiCheck /> {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="secondary-btn flex-1 flex items-center justify-center gap-2"
                >
                  <FiX /> {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
