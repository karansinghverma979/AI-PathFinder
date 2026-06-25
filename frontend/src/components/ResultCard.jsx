import React from 'react';
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

function ResultCard({ role, idx }) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: idx * 0.08 }}
      className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg transition-transform hover:scale-[1.02] hover:border-violet-500"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold flex items-center gap-2">{role.role_name} {role.pro && <span className="text-xs bg-yellow-400/80 text-black font-bold px-2 py-0.5 rounded">PRO</span>}</h4>
          <p className="text-sm text-slate-400">Level: {role.level}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-violet-400 font-semibold">{role.score ?? "—"}%</div>
          <div className="text-xs text-slate-500">Match Score</div>
        </div>
      </div>

      {role.missing_skills && role.missing_skills.length > 0 && (
        <div className="mt-3">
          <div className="text-sm text-red-400 mb-2 flex items-center gap-2"><FiAlertTriangle /> Missing Skills</div>
          <div className="flex flex-wrap gap-2">
            {role.missing_skills.map((m, i) => (
              <span key={i} className="px-3 py-1 bg-red-900/40 rounded-full text-sm">{m}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ResultCard;
