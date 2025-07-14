import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BarChartHorizontal, Home, Clock, Github, Menu } from 'lucide-react';
import { GameStats } from '../utils/stats';
import { PlayerStatsDisplay } from './PlayerStatsDisplay';

const DuetoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    <rect x="14" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

const TetraIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    <rect x="14" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    <rect x="2" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="15" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    <rect x="14" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="15" width="1" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

interface GameHeaderProps {
  onShowHelp: () => void;
  onShowStats: () => void;
  onShowAbout: () => void;
  onDueto: () => void;
  onQuarteto: () => void;
  onHome: () => void;
  onSpeedRun: () => void;
  stats: GameStats;
  mode: string;
  isVimMode: boolean;
}

const HeaderButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode; 'data-tour'?: string }> = ({ onClick, title, children, 'data-tour': dataTour }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-1.5 sm:p-2 rounded-lg text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-all duration-200"
    data-tour={dataTour}
  >
    {children}
  </button>
);

export function GameHeader({ onShowHelp, onShowStats, onShowAbout, onDueto, onQuarteto, onHome, onSpeedRun, stats, mode, isVimMode }: GameHeaderProps) {
  const [isModesMenuOpen, setModesMenuOpen] = useState(false);
  
  const modesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modesMenuRef.current && !modesMenuRef.current.contains(event.target as Node)) {
        setModesMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modesMenuRef]);

  const modeText = isVimMode ? 'COMMAND' : mode.toUpperCase();
  
  const vimStatus = isVimMode ? 'CMD' : 'RO';

  return (
    <header className="shadow-lg">
      <div className="w-full bg-[#6d28d9] py-1 px-2 sm:py-1.5 sm:px-4 flex justify-between items-center font-mono text-xs text-purple-200">
        <span className="truncate">{`>_ palavrim [${vimStatus}]`}</span>
        
        <span className="hidden sm:block">-- {modeText} --</span>
      </div>
      
      <div className="flex items-center justify-between py-2 px-2 sm:py-3 sm:px-6 bg-[#2d2d2d] rounded-b-xl">
        
        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderButton onClick={onShowHelp} title="Como jogar">
            <HelpCircle size={20} className="sm:w-6 sm:h-6" />
          </HeaderButton>
          <HeaderButton onClick={onShowStats} title="Estatísticas" data-tour="stats-button">
            <BarChartHorizontal size={20} className="sm:w-6 sm:h-6" />
          </HeaderButton>
          <div className="hidden sm:block">
            <HeaderButton onClick={onShowAbout} title="Sobre o Projeto">
              <Github size={18} className="sm:w-5 sm:h-5" />
            </HeaderButton>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={onHome} title="Voltar ao modo normal">
          <img src="/assets/images/Palavrim.png" alt="Palavrim" className="hidden sm:block h-6 w-6 sm:h-9 sm:w-9" />
          
          <h1 className="text-lg sm:text-3xl font-bold font-mono tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#a855f7]">
            Palavrim
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          
          <div className="hidden sm:block">
            <PlayerStatsDisplay stats={stats} />
          </div>
          
          <div className="hidden sm:flex items-center gap-1 sm:gap-2">
            <HeaderButton onClick={onHome} title="Modo Normal">
              <Home size={18} className="sm:w-5 sm:h-5" />
            </HeaderButton>
            <HeaderButton onClick={onDueto} title="Abracadupla">
              <DuetoIcon size={18} className="sm:w-5 sm:h-5" />
            </HeaderButton>
            <HeaderButton onClick={onQuarteto} title="Abracatetra">
              <TetraIcon size={18} className="sm:w-5 sm:h-5" />
            </HeaderButton>
            <HeaderButton onClick={onSpeedRun} title="Modo Mágico">
              <Clock size={18} className="sm:w-5 sm:h-5" />
            </HeaderButton>
          </div>

          <div className="sm:hidden relative" ref={modesMenuRef}>
            <HeaderButton onClick={() => setModesMenuOpen(prev => !prev)} title="Mudar modo de jogo">
              <Menu size={18} />
            </HeaderButton>
            
            {isModesMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#3a3a3a] rounded-md shadow-lg z-20">
                <div className="py-1">
                  <a href="#" onClick={(e) => { e.preventDefault(); onHome(); setModesMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4a4a4a]">
                    <Home size={16} /> Modo Normal
                  </a>
                  
                  <a href="#" onClick={(e) => { e.preventDefault(); onDueto(); setModesMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4a4a4a]">
                    <DuetoIcon size={16} /> Abracadupla
                  </a>
                  
                  <a href="#" onClick={(e) => { e.preventDefault(); onQuarteto(); setModesMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4a4a4a]">
                    <TetraIcon size={16} /> Abracatetra
                  </a>
                  
                  <a href="#" onClick={(e) => { e.preventDefault(); onSpeedRun(); setModesMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4a4a4a]">
                    <Clock size={16} /> Modo Mágico
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}