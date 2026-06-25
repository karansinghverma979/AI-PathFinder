import React from 'react';

function TabButton({ children, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`tab-button ${active ? "tab-button-active" : "tab-button-inactive"} flex items-center gap-2`}
    >
      {icon}
      {children}
    </button>
  );
}

export default TabButton;
