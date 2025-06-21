import React from 'react';
import { GameStats, getXpForNextLevel } from '../utils/stats';
import { BarChart, Star } from 'lucide-react';

interface PlayerStatsDisplayProps {
  stats: GameStats;
}

export const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({ stats }) => {
  const { level, rank, xp } = stats;
  const xpForNextLevel = getXpForNextLevel(level);
  const xpProgressPercentage = Math.min(100, Math.floor((xp / xpForNextLevel) * 100));

  return (
    <div className="flex items-center gap-4 text-[#d0d0d0] font-mono text-sm" data-tour="player-stats-display">
      <div className="flex items-center gap-2" title={`Nível ${level}`} data-tour="player-rank">
        <Star size={16} className="text-[#facc15]" />
        <span>{rank}</span>
      </div>
      <div className="w-32" data-tour="player-xp-bar">
        <div className="flex items-center gap-1.5">
          <div className="w-full bg-[#3a3a3a] rounded-full h-2.5" title={`${xp} / ${xpForNextLevel} XP`}>
            <div 
              className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${xpProgressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-purple-300 font-bold">{level + 1}</span>
        </div>
      </div>
    </div>
  );
}; 