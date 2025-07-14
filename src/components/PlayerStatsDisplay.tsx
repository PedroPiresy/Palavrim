import React from 'react';
import { GameStats, getXpForNextLevel } from '../utils/stats';
import { RankIcon } from './RankIcon';

interface PlayerStatsDisplayProps {
  stats: GameStats;
}

export const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({ stats }) => {
  const { level, rank, xp } = stats;
  const xpForNextLevel = getXpForNextLevel(level);
  const xpProgressPercentage = Math.min(100, Math.floor((xp / xpForNextLevel) * 100));

  return (
    <div className="flex items-center gap-2 sm:gap-4 text-[#d0d0d0] font-mono text-xs sm:text-sm" data-tour="player-stats-display">
      <div className="flex items-center gap-1 sm:gap-2" title={`Nível ${level} - ${rank}`} data-tour="player-rank">
        <RankIcon rank={rank} />
        <span className="hidden sm:inline flex-shrink-0">{rank}</span>
        <span className="sm:hidden">Nv.{level}</span>
      </div>
      <div className="w-16 sm:w-32" data-tour="player-xp-bar">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-full bg-[#3a3a3a] rounded-full h-2 sm:h-2.5" title={`${xp} / ${xpForNextLevel} XP`}>
            <div 
              className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] h-2 sm:h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${xpProgressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-purple-300 font-bold">{level + 1}</span>
        </div>
      </div>
    </div>
  );
};