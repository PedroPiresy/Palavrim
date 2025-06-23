import React from 'react';
import { X, Play, Home } from 'lucide-react';

// Componente SVG personalizado para o ícone do modo Abracatetra
const TetraIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="14" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="3" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="3" width="1" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="2" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="15" width="1" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="14" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="15" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="15" width="1" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

interface TetraHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onNormalMode: () => void;
}

export const TetraHelpModal: React.FC<TetraHelpModalProps> = ({ isOpen, onClose, onStart, onNormalMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#d0d0d0] font-mono flex items-center gap-2">
            <TetraIcon size={24} className="text-[#8b5cf6]" />
            Modo Abracatetra
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 text-[#d0d0d0] font-mono">
          <p className="text-center text-lg font-semibold text-[#8b5cf6]">
            Desafio supremo dos magos!
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-[#8b5cf6]">Como funciona:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TetraIcon size={20} className="text-[#facc15] mt-0.5" />
                <div>
                  <span className="font-semibold">Quatro grids:</span>
                  <p className="text-sm text-[#a0a0a0]">Você precisa descobrir quatro palavras diferentes simultaneamente</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Play size={20} className="text-[#4ade80] mt-0.5" />
                <div>
                  <span className="font-semibold">Uma tentativa, quatro resultados:</span>
                  <p className="text-sm text-[#a0a0a0]">Cada palpite é testado contra todas as quatro palavras</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#8b5cf6] text-xl mt-0.5">9</span>
                <div>
                  <span className="font-semibold">Mais tentativas:</span>
                  <p className="text-sm text-[#a0a0a0]">Você tem 9 tentativas para descobrir todas as palavras</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-[#8b5cf6]">Estratégia Avançada:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Comece com palavras ricas em vogais</li>
              <li>• Observe padrões em todos os quatro grids</li>
              <li>• Use informações de uma palavra para ajudar nas outras</li>
              <li>• Gerencie bem suas tentativas limitadas</li>
              <li>• Foque nas palavras mais próximas de serem resolvidas</li>
            </ul>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
            <p className="text-yellow-200 text-sm font-semibold">
              ⚠️ Modo para magos experientes! Este é o desafio mais difícil do Palavrim.
            </p>
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
              Começar Abracatetra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};