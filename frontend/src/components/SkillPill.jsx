import React from 'react';
import { FiStar } from "react-icons/fi";

function SkillPill({ text, pro = false }) {
  return (
    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${pro ? 'bg-yellow-400/20 text-yellow-300' : 'bg-slate-700/60 text-slate-300'}`}>
      {pro && <FiStar className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );
}

export default SkillPill;
