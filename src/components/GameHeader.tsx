import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BarChartHorizontal, Home, Clock, Github, Menu } from 'lucide-react';
import { GameStats } from '../utils/stats';
import { PlayerStatsDisplay } from './PlayerStatsDisplay';

// Componente SVG personalizado para o ícone do modo Abracadupla (2 grids lado a lado)
const DuetoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Grid esquerdo - primeiro jogo */}
    <rect x="2" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid direito - segundo jogo */}
    <rect x="14" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Componente SVG personalizado para o ícone do modo Abracatetra (4 grids em 2x2)
const TetraIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Grid superior esquerdo - primeiro jogo */}
    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid superior direito - segundo jogo */}
    <rect x="14" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid inferior esquerdo - terceiro jogo */}
    <rect x="2" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="15" width="1" height="2" fill="currentColor" opacity="0.3"/>
    
    {/* Grid inferior direito - quarto jogo */}
    <rect x="14" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="15" width="1" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Interface que define todas as propriedades que o header recebe
interface GameHeaderProps {
  onShowHelp: () => void;      // Função para mostrar a ajuda
  onShowStats: () => void;     // Função para mostrar estatísticas
  onShowAbout: () => void;     // Função para mostrar sobre o projeto
  onDueto: () => void;         // Função para ativar modo Abracadupla
  onQuarteto: () => void;      // Função para ativar modo Abracatetra
  onHome: () => void;          // Função para voltar ao modo normal
  onSpeedRun: () => void;      // Função para ativar modo Speed Run
  stats: GameStats;            // Estatísticas do jogador
  mode: string;                // Modo atual do jogo
  isVimMode: boolean;          // Se está no modo Vim
}

// Componente reutilizável para botões do header
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

// Componente principal do header do jogo
export function GameHeader({ onShowHelp, onShowStats, onShowAbout, onDueto, onQuarteto, onHome, onSpeedRun, stats, mode, isVimMode }: GameHeaderProps) {
  // Estado para controlar se o menu de modos está aberto (mobile)
  const [isModesMenuOpen, setModesMenuOpen] = useState(false);
  
  // Referência para detectar cliques fora do menu
  const modesMenuRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar o menu quando clicar fora dele
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

  // Texto do modo atual (COMMAND se estiver no modo Vim, senão o modo em maiúsculo)
  const modeText = isVimMode ? 'COMMAND' : mode.toUpperCase();
  
  // Status do Vim (CMD = Command mode, RO = Read Only)
  const vimStatus = isVimMode ? 'CMD' : 'RO';

  return (
    <header className="shadow-lg">
      {/* Barra superior com informações do terminal */}
      <div className="w-full bg-[#6d28d9] py-1 px-2 sm:py-1.5 sm:px-4 flex justify-between items-center font-mono text-xs text-purple-200">
        {/* Texto do terminal com status do Vim */}
        <span className="truncate">{`>_ palavrim [${vimStatus}]`}</span>
        
        {/* Modo atual do jogo */}
        <span className="hidden sm:block">-- {modeText} --</span>
      </div>
      
      {/* Barra principal do header */}
      <div className="flex items-center justify-between py-2 px-2 sm:py-3 sm:px-6 bg-[#2d2d2d] rounded-b-xl">
        
        {/* Botões da esquerda - Ajuda, Estatísticas e Sobre */}
        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderButton onClick={onShowHelp} title="Como jogar">
            <HelpCircle size={20} className="sm:w-6 sm:h-6" />
          </HeaderButton>
          <HeaderButton onClick={onShowStats} title="Estatísticas" data-tour="stats-button">
            <BarChartHorizontal size={20} className="sm:w-6 sm:h-6" />
          </HeaderButton>
          {/* Botão Sobre - visível apenas em telas grandes */}
          <div className="hidden sm:block">
            <HeaderButton onClick={onShowAbout} title="Sobre o Projeto">
              <Github size={18} className="sm:w-5 sm:h-5" />
            </HeaderButton>
          </div>
        </div>

        {/* Logo e título central - clicável para voltar ao modo normal */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={onHome} title="Voltar ao modo normal">
          {/* Logo do Palavrim - visível apenas em telas grandes */}
          <img src="/assets/images/Palavrim.png" alt="Palavrim" className="hidden sm:block h-6 w-6 sm:h-9 sm:w-9" />
          
          {/* Título com gradiente roxo */}
          <h1 className="text-lg sm:text-3xl font-bold font-mono tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#a855f7]">
            Palavrim
          </h1>
        </div>
        
        {/* Botões da direita - Estatísticas do jogador e modos de jogo */}
        <div className="flex items-center gap-2 sm:gap-6">
          
          {/* Estatísticas do jogador - oculto em mobile muito pequeno */}
          <div className="hidden sm:block">
            <PlayerStatsDisplay stats={stats} />
          </div>
          
          {/* Botões de modo para telas grandes */}
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

          {/* Menu dropdown de modos para telas pequenas */}
          <div className="sm:hidden relative" ref={modesMenuRef}>
            <HeaderButton onClick={() => setModesMenuOpen(prev => !prev)} title="Mudar modo de jogo">
              <Menu size={18} />
            </HeaderButton>
            
            {/* Menu dropdown que aparece quando clicado */}
            {isModesMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#3a3a3a] rounded-md shadow-lg z-20">
                <div className="py-1">
                  {/* Opção Modo Normal */}
                  <a href="#" onClick={(e) => { e.preventDefault(); onHome(); setModesMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4a4a4a]">
                    <Home size={16} /> Modo Normal
                  </a>
                  
                  {/* Opção Abracadupla */}
                  <a href="#" onClick={(e) => { e.preventDefault(); onDueto(); setModesMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4a4a4a]">
                    <DuetoIcon size={16} /> Abracadupla
                  </a>
                  
                  {/* Opção Abracatetra */}
                  <a href="#" onClick={(e) => { e.preventDefault(); onQuarteto(); setModesMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4a4a4a]">
                    <TetraIcon size={16} /> Abracatetra
                  </a>
                  
                  {/* Opção Modo Mágico */}
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