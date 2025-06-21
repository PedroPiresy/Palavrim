import React, { useState, useMemo } from 'react';
import { X, BarChartHorizontal, Trophy, Repeat, Medal, Skull, Star, Zap, BarChart2, TrendingUp, Atom, BookOpen } from 'lucide-react';
import { GameStats, WeeklyData, getXpForNextLevel } from '../utils/stats';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';

type Tab = 'summary' | 'guesses' | 'letters' | 'evolution';

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

// Componente para uma aba
const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-200 flex items-center gap-2 ${
      active
        ? 'bg-purple-600 text-white'
        : 'text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
    }`}
  >
    {children}
  </button>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
  return (
      <div className="bg-[#1a1a1a] p-2 border border-purple-500 rounded-lg">
        <p className="font-bold text-purple-300">{`Tentativa ${label}: ${payload[0].value} vitórias`}</p>
      </div>
    );
  }
  return null;
};

const CustomLetterTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] p-2 border border-green-500 rounded-lg">
          <p className="font-bold text-green-300">{`Letra "${label}": ${payload[0].value} usos`}</p>
    </div>
  );
    }
    return null;
};
  
const CustomEvolutionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1a1a] p-3 border border-yellow-500 rounded-lg text-sm">
          <p className="font-bold text-yellow-300 mb-1">{`Semana de ${label}`}</p>
          <p className="text-white">{`Vitórias: ${data.winRate.toFixed(0)}% (${data.gamesWon}/${data.gamesPlayed})`}</p>
          <p className="text-white">{`Média de Tentativas: ${data.avgAttempts.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="h-64 w-full flex flex-col items-center justify-center text-center text-gray-500">
        <Atom size={32} className="mb-4" />
        <p className="font-mono text-sm">{message}</p>
    </div>
);

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const guessDistributionData = useMemo(() => {
    return Object.entries(stats.guesses)
      .map(([guess, count]) => ({
        name: guess,
        count,
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [stats.guesses]);

  const letterFrequencyData = useMemo(() => {
    return Object.entries(stats.letterFrequency || {})
      .map(([letter, count]) => ({ name: letter, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 letters
  }, [stats.letterFrequency]);

  const weeklyEvolutionData = useMemo(() => {
    return (stats.weeklyEvolution || []).map(week => {
      const winRate = week.gamesPlayed > 0 ? (week.gamesWon / week.gamesPlayed) * 100 : 0;
      const avgAttempts = week.gamesWon > 0 ? week.totalAttemptsOnWin / week.gamesWon : 0;
      const date = new Date(week.weekStartDate);
      const formattedDate = `${String(date.getDate() + 1).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      return {
        name: formattedDate,
        winRate,
        avgAttempts,
        gamesPlayed: week.gamesPlayed,
        gamesWon: week.gamesWon,
      };
    });
  }, [stats.weeklyEvolution]);

  if (!isOpen) return null;

  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const xpForNextLevel = getXpForNextLevel(stats.level);
  const xpProgressPercentage = Math.min(100, Math.floor((stats.xp / xpForNextLevel) * 100));

  const renderContent = () => {
    switch (activeTab) {
      case 'guesses':
        return (
            guessDistributionData.reduce((acc, bar) => acc + bar.count, 0) === 0
            ? <EmptyState message="Suas vitórias e o número de tentativas aparecerão aqui." />
            : <div className="h-64 w-full">
                <ResponsiveContainer>
                    <BarChart data={guessDistributionData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff10' }}/>
                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
      case 'letters':
        return (
            letterFrequencyData.length === 0
            ? <EmptyState message="Jogue uma partida para ver as letras que você mais usa." />
            : <div className="h-64 w-full">
                <ResponsiveContainer>
                    <BarChart data={letterFrequencyData} layout="vertical" margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                        <XAxis type="number" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="name" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomLetterTooltip />} cursor={{ fill: '#ffffff10' }}/>
                        <Bar dataKey="count" fill="#4ade80" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
      case 'evolution':
        return (
            weeklyEvolutionData.filter(d => d.gamesPlayed > 0).length === 0
            ? <EmptyState message="Sua evolução de vitórias será exibida aqui a cada semana." />
            : <div className="h-64 w-full">
                <ResponsiveContainer>
                    <LineChart data={weeklyEvolutionData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                        <XAxis dataKey="name" stroke="#a7a7a7" fontSize={12} />
                        <YAxis yAxisId="left" stroke="#8b5cf6" label={{ value: 'Vitórias (%)', angle: -90, position: 'insideLeft', fill: '#8b5cf6' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#facc15" label={{ value: 'Média Tentativas', angle: 90, position: 'insideRight', fill: '#facc15' }} />
                        <Tooltip content={<CustomEvolutionTooltip />} cursor={{ stroke: '#ffffff30' }}/>
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="winRate" name="Vitórias (%)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="avgAttempts" name="Média Tentativas" stroke="#facc15" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
      case 'summary':
      default:
        return (
          <>
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
            <div className="grid grid-cols-4 gap-4 text-center">
              <StatItem value={stats.gamesPlayed} label="jogos" />
              <StatItem value={`${winPercentage}%`} label="de vitórias" />
              <StatItem value={stats.winStreak} label="sequência atual" />
              <StatItem value={stats.maxWinStreak} label="melhor sequência" />
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-xl border border-[#3d3d3d] max-w-lg w-full max-h-[90vh] overflow-y-auto font-mono flex flex-col">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <BarChartHorizontal size={22} className="text-[#8b5cf6]" />
            Progresso Arcano
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-[#2a2a2a] p-1.5 rounded-xl mb-6">
                <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}><Atom size={16}/> Resumo</TabButton>
                <TabButton active={activeTab === 'guesses'} onClick={() => setActiveTab('guesses')}><BarChart2 size={16}/> Tentativas</TabButton>
                <TabButton active={activeTab === 'letters'} onClick={() => setActiveTab('letters')}><BookOpen size={16}/> Letras</TabButton>
                <TabButton active={activeTab === 'evolution'} onClick={() => setActiveTab('evolution')}><TrendingUp size={16}/> Evolução</TabButton>
            </div>
          </div>
        
        <div className="p-6 pt-0 space-y-6 flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}; 