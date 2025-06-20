import React from 'react';
import { X, BarChartHorizontal, Trophy, Repeat, Medal, Skull } from 'lucide-react';
import { GameStats } from '../utils/stats';

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

  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxDistributionValue = Math.max(...Object.values(stats.guessDistribution), stats.failures, 1);

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
          <div className="grid grid-cols-4 gap-4 text-center">
            <StatItem value={stats.gamesPlayed} label="jogos" />
            <StatItem value={`${winPercentage}%`} label="de vitórias" />
            <StatItem value={stats.currentStreak} label="sequência de vitórias" />
            <StatItem value={stats.maxStreak} label="melhor sequência" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-center text-white">Distribuição de Tentativas</h3>
            <div className="space-y-2">
              {Object.entries(stats.guessDistribution).map(([guess, count]) => (
                <DistributionBar key={guess} label={parseInt(guess)} count={count} maxValue={maxDistributionValue} />
              ))}
              <DistributionBar label={<Skull size={16} />} count={stats.failures} maxValue={maxDistributionValue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 