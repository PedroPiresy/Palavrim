import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, 
  BarChart3, 
  Home, 
  Clock, 
  Github, 
  Menu, 
  X,
  Zap,
  Star,
  Trophy
} from 'lucide-react';
import { GameStats, getXpForNextLevel } from '../utils/stats';

const DuetoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="8" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="5" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="6" y="5" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="14" y="4" width="8" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="5" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="18" y="5" width="2" height="2" fill="currentColor" opacity="0.6"/>
  </svg>
);

const TetraIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="3" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="6" y="3" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="14" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="3" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="18" y="3" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="2" y="14" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="15" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="6" y="15" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="14" y="14" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="15" width="2" height="2" fill="currentColor" opacity="0.6"/>
    <rect x="18" y="15" width="2" height="2" fill="currentColor" opacity="0.6"/>
  </svg>
);

interface ModernHeaderProps {
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

const HeaderButton: React.FC<{ 
  onClick: () => void; 
  title: string; 
  children: React.ReactNode; 
  'data-tour'?: string;
  variant?: 'ghost' | 'primary';
}> = ({ onClick, title, children, 'data-tour': dataTour, variant = 'ghost' }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2.5 rounded-xl transition-all duration-200 ${
      variant === 'primary' 
        ? 'btn-primary' 
        : 'btn-ghost hover:bg-[var(--bg-hover)]'
    }`}
    data-tour={dataTour}
  >
    {children}
  </button>
);

const PlayerStats: React.FC<{ stats: GameStats }> = ({ stats }) => {
  const { level, rank, xp } = stats;
  const xpForNextLevel = getXpForNextLevel(level);
  const xpProgressPercentage = Math.min(100, Math.floor((xp / xpForNextLevel) * 100));

  return (
    <div className="flex items-center gap-3 text-sm" data-tour="player-stats-display">
      <div className="flex items-center gap-2" title={`Nível ${level} - ${rank}`} data-tour="player-rank">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-hover)] flex items-center justify-center">
          <Trophy size={14} className="text-white" />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-[var(--text-primary)] font-semibold text-xs leading-none">{rank}</span>
          <span className="text-[var(--text-secondary)] text-xs leading-none">Nível {level}</span>
        </div>
        <span className="sm:hidden text-[var(--text-primary)] font-semibold">Nv.{level}</span>
      </div>
      
      <div className="w-20 sm:w-32" data-tour="player-xp-bar">
        <div className="flex items-center gap-2">
          <div className="progress-bar w-full h-2" title={`${xp} / ${xpForNextLevel} XP`}>
            <div 
              className="progress-fill h-full transition-all duration-500" 
              style={{ width: `${xpProgressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-[var(--accent-blue)] font-bold">{level + 1}</span>
        </div>
      </div>

      <div className="flex items-center gap-1" title={`${stats.mana} Mana`}>
        <Zap size={14} className="text-[var(--warning)]" />
        <span className="text-[var(--warning)] font-semibold text-xs">{stats.mana}</span>
      </div>
    </div>
  );
};

export function ModernHeader({ 
  onShowHelp, 
  onShowStats, 
  onShowAbout, 
  onDueto, 
  onQuarteto, 
  onHome, 
  onSpeedRun, 
  stats, 
  mode, 
  isVimMode 
}: ModernHeaderProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const modeText = isVimMode ? 'COMMAND' : mode.toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      {/* Status bar */}
      <div className="w-full bg-[var(--bg-secondary)] py-1.5 px-4 flex justify-between items-center text-xs font-mono">
        <span className="text-[var(--text-secondary)]">palavrim.app</span>
        <span className="text-[var(--accent-blue)]">-- {modeText} --</span>
      </div>
      
      {/* Main header */}
      <div className="flex items-center justify-between py-3 px-4 max-w-7xl mx-auto">
        
        {/* Left section */}
        <div className="flex items-center gap-2">
          <HeaderButton onClick={onShowHelp} title="Como jogar">
            <HelpCircle size={20} />
          </HeaderButton>
          <HeaderButton onClick={onShowStats} title="Estatísticas" data-tour="stats-button">
            <BarChart3 size={20} />
          </HeaderButton>
          <div className="hidden sm:block">
            <HeaderButton onClick={onShowAbout} title="Sobre o Projeto">
              <Github size={18} />
            </HeaderButton>
          </div>
        </div>

        {/* Center - Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onHome} 
          title="Voltar ao modo normal"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-hover)] flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/assets/images/Palavrim.png" alt="Palavrim" className="w-6 h-6" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient">
            Palavrim
          </h1>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-4">
          
          {/* Player stats - hidden on mobile */}
          <div className="hidden lg:block">
            <PlayerStats stats={stats} />
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center gap-1">
            <HeaderButton onClick={onHome} title="Modo Normal">
              <Home size={18} />
            </HeaderButton>
            <HeaderButton onClick={onDueto} title="Abracadupla">
              <DuetoIcon size={18} />
            </HeaderButton>
            <HeaderButton onClick={onQuarteto} title="Abracatetra">
              <TetraIcon size={18} />
            </HeaderButton>
            <HeaderButton onClick={onSpeedRun} title="Modo Velocidade">
              <Clock size={18} />
            </HeaderButton>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden relative" ref={menuRef}>
            <HeaderButton onClick={() => setMenuOpen(!isMenuOpen)} title="Menu">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </HeaderButton>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 card-elevated rounded-xl shadow-xl z-50 animate-scale-in">
                <div className="p-2">
                  {/* Player stats on mobile */}
                  <div className="p-3 border-b border-[var(--border-primary)] mb-2">
                    <PlayerStats stats={stats} />
                  </div>
                  
                  {/* Menu items */}
                  <div className="space-y-1">
                    <button 
                      onClick={() => { onHome(); setMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                    >
                      <Home size={16} /> Modo Normal
                    </button>
                    
                    <button 
                      onClick={() => { onDueto(); setMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                    >
                      <DuetoIcon size={16} /> Abracadupla
                    </button>
                    
                    <button 
                      onClick={() => { onQuarteto(); setMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                    >
                      <TetraIcon size={16} /> Abracatetra
                    </button>
                    
                    <button 
                      onClick={() => { onSpeedRun(); setMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                    >
                      <Clock size={16} /> Modo Velocidade
                    </button>

                    <div className="border-t border-[var(--border-primary)] my-2"></div>
                    
                    <button 
                      onClick={() => { onShowAbout(); setMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                    >
                      <Github size={16} /> Sobre o Projeto
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}