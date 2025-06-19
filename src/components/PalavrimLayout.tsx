import { ReactNode } from 'react';
import { Terminal } from 'lucide-react';

interface PalavrimLayoutProps {
  children: ReactNode;
}

export default function PalavrimLayout({ children }: PalavrimLayoutProps) {
  return (
    <div style={{ backgroundColor: '#1a1a1a' }} className="min-h-screen text-green-400 font-mono overflow-hidden relative">
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Palavrim status bar */}
        <div className="bg-purple-800 text-white px-4 py-1 text-sm border-b border-purple-600">
          <div className="flex justify-between items-center">
            <span className="flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>palavrim [RO]</span>
            </span>
            <span className="text-purple-200">-- NORMAL --</span>
          </div>
        </div>

        {/* Main content area (sem sidebar de linha) */}
        <div className="flex flex-1">
          <div className="flex-1 p-8 relative">
            <div className="flex flex-col items-center justify-center min-h-full space-y-8">
              {children}
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="bg-purple-800 text-purple-100 px-4 py-1 text-xs border-t border-purple-600">
          <div className="flex justify-between">
            <span>palavrim [readonly] 1L, 3C</span>
            <span>utf-8[unix]</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: #7c3aed;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>
    </div>
  );
} 