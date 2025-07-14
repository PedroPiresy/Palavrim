import React from 'react';
import { X, Play, Home } from 'lucide-react';

const DuetoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="3" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="6" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="14" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="15" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="5" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="5" width="1" height="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

interface DuetoHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onNormalMode: () => void;
}

export const DuetoHelpModal: React.FC<DuetoHelpModalProps> = ({ isOpen, onClose, onStart, onNormalMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#d0d0d0] font-mono flex items-center gap-2">
            <DuetoIcon size={24} className="text-[#8b5cf6]" />
            Modo Abracadupla
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
            Duplo desafio mágico!
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-[#8b5cf6]">Como funciona:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <DuetoIcon size={20} className="text-[#facc15] mt-0.5" />
                <div>
                  <span className="font-semibold">Dois grids:</span>
                  <p className="text-sm text-[#a0a0a0]">Você precisa descobrir duas palavras diferentes ao mesmo tempo</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Play size={20} className="text-[#4ade80] mt-0.5" />
                <div>
                  <span className="font-semibold">Uma tentativa, dois resultados:</span>
                  <p className="text-sm text-[#a0a0a0]">Cada palpite é testado contra ambas as palavras simultaneamente</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#8b5cf6] text-xl mt-0.5">7</span>
                <div>
                  <span className="font-semibold">Mais tentativas:</span>
                  <p className="text-sm text-[#a0a0a0]">Você tem 7 tentativas para descobrir ambas as palavras</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-[#8b5cf6]">Estratégia:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Use palavras com letras variadas no início</li>
              <li>• Observe as cores em ambos os grids</li>
              <li>• Uma palavra pode dar dicas para a outra</li>
              <li>• Você pode acertar uma palavra antes da outra</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNormalMode}
              className="py-2 px-4 rounded-lg bg-[#2d2d2d] text-[#d0d0d0] font-bold text-sm hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home size={16} />
              <span className="whitespace-nowrap">Modo Normal</span>
            </button>
            <button
              onClick={onStart}
              className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white font-bold text-sm hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Play size={16} />
              Começar Abracadupla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};