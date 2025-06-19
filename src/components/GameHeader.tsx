import React from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';

interface GameHeaderProps {
  onShowHelp: () => void;
  onRestart: () => void;
  onDueto: () => void;
  onQuarteto: () => void;
  onHome: () => void;
  onTrainingMode: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onShowHelp, onRestart, onDueto, onQuarteto, onHome, onTrainingMode }) => {
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
            onClick={onTrainingMode}
            className="p-3 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:text-[#8b5cf6] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-mono"
            title="Training Mode"
          >
            Training Mode
          </button>
          <button
            onClick={onDueto}
            className="p-3 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:text-[#8b5cf6] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-mono"
            title="Modo Abracadupla"
          >
            Abracadupla
          </button>
          <button
            onClick={onQuarteto}
            className="p-3 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:text-[#8b5cf6] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-mono"
            title="Modo Abracatetra"
          >
            Abracatetra
          </button>
          {/*
          <button
            onClick={onRestart}
            className="p-3 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-mono"
            title="Reiniciar jogo"
          >
            <RotateCcw size={20} />
          </button>
          */}
          <button
            onClick={onShowHelp}
            className="p-3 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 font-mono"
            title="Como jogar"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};