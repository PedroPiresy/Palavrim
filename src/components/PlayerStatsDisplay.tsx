import React from 'react';
import { GameStats, getXpForNextLevel } from '../utils/stats';
import { RankIcon } from './RankIcon';

// Interface que define as propriedades que este componente recebe
interface PlayerStatsDisplayProps {
  stats: GameStats; // Recebe as estatísticas do jogador
}

// Componente que exibe as estatísticas do jogador no header do jogo
export const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({ stats }) => {
  // Extrai os dados necessários das estatísticas
  const { level, rank, xp } = stats;
  
  // Calcula quantos XP são necessários para o próximo nível
  const xpForNextLevel = getXpForNextLevel(level);
  
  // Calcula a porcentagem de progresso para o próximo nível (máximo 100%)
  const xpProgressPercentage = Math.min(100, Math.floor((xp / xpForNextLevel) * 100));

  return (
    // Container principal com espaçamento e cores
    <div className="flex items-center gap-2 sm:gap-4 text-[#d0d0d0] font-mono text-xs sm:text-sm" data-tour="player-stats-display">
      
      {/* Seção do nível/rank do jogador */}
      <div className="flex items-center gap-1 sm:gap-2" title={`Nível ${level} - ${rank}`} data-tour="player-rank">
        {/* Ícone dinâmico do rank */}
        <RankIcon rank={rank} />
        
        {/* Texto do rank (ex: "Aprendiz de Letras") - visível apenas em telas grandes */}
        <span className="hidden sm:inline flex-shrink-0">{rank}</span>
        
        {/* Texto simplificado para mobile (ex: "Nv.1") */}
        <span className="sm:hidden">Nv.{level}</span>
      </div>
      
      {/* Barra de progresso de XP */}
      <div className="w-16 sm:w-32" data-tour="player-xp-bar">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Container da barra de progresso */}
          <div className="w-full bg-[#3a3a3a] rounded-full h-2 sm:h-2.5" title={`${xp} / ${xpForNextLevel} XP`}>
            {/* Barra de progresso preenchida com gradiente roxo */}
            <div 
              className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] h-2 sm:h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${xpProgressPercentage}%` }}
            />
          </div>
          
          {/* Número do próximo nível */}
          <span className="text-xs text-purple-300 font-bold">{level + 1}</span>
        </div>
      </div>
    </div>
  );
};