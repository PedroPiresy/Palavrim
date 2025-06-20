import React from 'react';

const PalavrimLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Bottom status bar */}
      <footer className="w-full bg-[#6d28d9] py-1 px-4 flex justify-between items-center font-mono text-xs text-purple-200 shadow-lg">
        <span>palavrim [v1.1.0]</span>
        <span>utf-8[unix]</span>
      </footer>
    </div>
  );
};

export default PalavrimLayout; 