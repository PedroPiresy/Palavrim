import React from 'react';
import { HelpCircle, BarChartHorizontal, Home, Zap, Github } from 'lucide-react';
import { GameStats } from '../utils/stats';
import { PlayerStatsDisplay } from './PlayerStatsDisplay';

// Componente SVG para Abracadupla (2 grids lado a lado)
const DuetoIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid esquerdo */}
    <rect x="2" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid direito */}
    <rect x="14" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Componente SVG para Abracatetra (4 grids em 2x2)
const TetraIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid superior esquerdo */}
    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid superior direito */}
    <rect x="14" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid inferior esquerdo */}
    <rect x="2" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="15" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid inferior direito */}
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
    className="p-2 rounded-lg text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-all duration-200"
    data-tour={dataTour}
  >
    {children}
  </button>
);

export function GameHeader({ onShowHelp, onShowStats, onShowAbout, onDueto, onQuarteto, onHome, onSpeedRun, stats, mode, isVimMode }: GameHeaderProps) {
  const modeText = isVimMode ? 'COMMAND' : mode.toUpperCase();
  const vimStatus = isVimMode ? 'CMD' : 'RO';

  return (
    <header className="shadow-lg">
      <div className="w-full bg-[#6d28d9] py-1.5 px-4 flex justify-between items-center font-mono text-xs text-purple-200">
        <span>{`>_ palavrim [${vimStatus}]`}</span>
        <span>-- {modeText} --</span>
      </div>
      
      <div className="flex items-center justify-between py-3 px-6 bg-[#2d2d2d] rounded-b-xl">
        <div className="flex items-center gap-2">
          <HeaderButton onClick={onShowHelp} title="Como jogar">
            <HelpCircle size={24} />
          </HeaderButton>
          <HeaderButton onClick={onShowStats} title="Estatísticas" data-tour="stats-button">
            <BarChartHorizontal size={24} />
          </HeaderButton>
          <HeaderButton onClick={onShowAbout} title="Sobre o Projeto">
            <Github size={22} />
          </HeaderButton>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 cursor-pointer" onClick={onHome} title="Voltar ao modo normal">
          <img src="/assets/images/Palavrim.png" alt="Palavrim" className="h-9 w-9" />
          <h1 className="text-3xl font-bold font-mono tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#a855f7]">
            Palavrim
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <PlayerStatsDisplay stats={stats} />
        <div className="flex items-center gap-2">
            <HeaderButton onClick={onHome} title="Modo Normal">
              <Home size={22} />
            </HeaderButton>
            <HeaderButton onClick={onDueto} title="Abracadupla">
              <DuetoIcon size={22} />
            </HeaderButton>
            <HeaderButton onClick={onQuarteto} title="Abracatetra">
              <TetraIcon size={22} />
            </HeaderButton>
            <HeaderButton onClick={onSpeedRun} title="Modo Mágico">
              <Zap size={22} />
            </HeaderButton>
          </div>
        </div>
      </div>
    </header>
  );
}