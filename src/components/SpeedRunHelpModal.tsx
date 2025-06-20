import React from 'react';
import { Clock, Play, Home } from 'lucide-react';

interface SpeedRunHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onNormalMode: () => void;
}

export const SpeedRunHelpModal: React.FC<SpeedRunHelpModalProps> = ({ isOpen, onClose, onStart, onNormalMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#d0d0d0] font-mono flex items-center gap-2">
            <Clock size={24} className="text-[#8b5cf6]" />
            Modo Speed Run
          </h2>
        </div>
        
        <div className="p-6 space-y-4 text-[#d0d0d0] font-mono">
          <p className="text-center text-lg font-semibold text-[#8b5cf6]">
            Teste sua velocidade!
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-[#8b5cf6]">Como funciona:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#facc15] mt-0.5" />
                <div>
                  <span className="font-semibold">Cronômetro:</span>
                  <p className="text-sm text-[#a0a0a0]">O tempo começa quando você clicar em "Começar" e para quando acertar a palavra</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Play size={20} className="text-[#4ade80] mt-0.5" />
                <div>
                  <span className="font-semibold">Objetivo:</span>
                  <p className="text-sm text-[#a0a0a0]">Descubra a palavra secreta o mais rápido possível!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-[#8b5cf6]">Regras:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Você tem 6 tentativas para acertar</li>
              <li>• Use palavras reais em português</li>
              <li>• O cronômetro mostra seu tempo final</li>
              <li>• Tente bater seu recorde pessoal!</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNormalMode}
              className="flex-1 py-3 px-5 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] font-bold text-base hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Modo Normal
            </button>
            <button
              onClick={onStart}
              className="flex-1 py-3 px-5 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white font-bold text-base hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Play size={18} />
              Começar Speed Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 