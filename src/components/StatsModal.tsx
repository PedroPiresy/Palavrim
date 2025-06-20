import React from 'react';
import { X, BarChartHorizontal, Trophy, Repeat, Medal, Skull, Star, Zap } from 'lucide-react';
import { GameStats, getXpForNextLevel } from '../utils/stats';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

const StatItem: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-bold text-white">{value}</span>
    <span className="text-xs text-gray-400 text-center">{label}</span>
  </div>
);

const DistributionBar: React.FC<{ label: React.ReactNode; count: number; maxValue: number, isLastWin?: boolean }> = ({ label, count, maxValue, isLastWin }) => {
  const widthPercentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="text-white font-bold w-6 text-center">{label}</div>
      <div className={`flex items-center justify-end h-5 rounded ${count > 0 ? 'bg-purple-600' : 'bg-gray-700'}`} style={{ width: `${widthPercentage}%`, minWidth: '24px' }}>
        <span className="pr-2 text-sm font-bold text-white">{count}</span>
      </div>
    </div>
  );
};

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const maxDistributionValue = Math.max(...Object.values(stats.guesses), 1);
  const xpForNextLevel = getXpForNextLevel(stats.level);
  const xpProgressPercentage = Math.min(100, Math.floor((stats.xp / xpForNextLevel) * 100));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-md w-full max-h-[90vh] overflow-y-auto font-mono">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <BarChartHorizontal size={22} className="text-[#8b5cf6]" />
            Progresso
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Rank e Nível */}
          <div className="bg-[#2d2d2d] rounded-lg p-4 border border-[#3d3d3d]">
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} className="text-[#facc15]" />
              <h3 className="text-lg font-bold text-white">{stats.rank}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Nível {stats.level}</span>
                <span className="text-white">{stats.xp} / {xpForNextLevel} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-[#3a3a3a] rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${xpProgressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-purple-300">{stats.level + 1}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Zap size={16} className="text-[#fbbf24]" />
              <span className="text-sm text-gray-400">Mana: {stats.mana}</span>
            </div>
          </div>

          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <StatItem value={stats.gamesPlayed} label="jogos" />
            <StatItem value={`${winPercentage}%`} label="de vitórias" />
            <StatItem value={stats.winStreak} label="sequência atual" />
            <StatItem value={stats.maxWinStreak} label="melhor sequência" />
          </div>

          {/* Distribuição de Tentativas */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-center text-white">Distribuição de Tentativas</h3>
            <div className="space-y-2">
              {Object.entries(stats.guesses).map(([guess, count]) => (
                <DistributionBar key={guess} label={parseInt(guess)} count={count} maxValue={maxDistributionValue} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 