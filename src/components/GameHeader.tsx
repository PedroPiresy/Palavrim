import React from 'react';
import { HelpCircle, Clock, Dumbbell, Copy, Boxes, BarChartHorizontal } from 'lucide-react';

interface GameHeaderProps {
  onShowHelp: () => void;
  onShowStats: () => void;
  onDueto: () => void;
  onQuarteto: () => void;
  onHome: () => void;
  onSpeedRun: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onShowHelp, onShowStats, onDueto, onQuarteto, onHome, onSpeedRun }) => {
  return (
    <header className="w-full bg-[#1a1a1a] p-0 m-0 rounded-b-2xl">
      <div className="w-full max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="">
            <img src="/assets/images/Palavrim.png" alt="Palavrim" className="w-10 h-10" />
          </div>
          <button
            onClick={onHome}
            className="text-2xl font-bold text-[#8b5cf6] font-mono bg-transparent border-none outline-none cursor-pointer hover:underline"
            style={{ padding: 0, margin: 0 }}
            title="Voltar ao modo normal"
          >
            Palavrim
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onSpeedRun}
            className="py-2 px-4 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] hover:text-[#8b5cf6] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-bold text-base flex items-center justify-center gap-2"
            title="Speed Run Mode"
          >
            <Clock size={16} />
            Speed Run
          </button>
          <button
            onClick={onDueto}
            className="py-2 px-4 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] hover:text-[#8b5cf6] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-bold text-base flex items-center justify-center gap-2"
            title="Modo Abracadupla"
          >
            <Copy size={16} />
            Dueto
          </button>
          <button
            onClick={onQuarteto}
            className="py-2 px-4 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] hover:text-[#8b5cf6] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-bold text-base flex items-center justify-center gap-2"
            title="Modo Abracatetra"
          >
            <Boxes size={16} />
            Quarteto
          </button>
          <button
            onClick={onShowStats}
            className="p-2.5 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200"
            title="Estatísticas"
          >
            <BarChartHorizontal size={20} />
          </button>
          <button
            onClick={onShowHelp}
            className="p-2.5 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200"
            title="Como jogar"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};