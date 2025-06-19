import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#d0d0d0] font-mono">Como Jogar</h2>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 text-[#d0d0d0] font-mono">
          <p>
            Descubra a palavra secreta em até 6 tentativas!
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-[#8b5cf6]">Como funciona:</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4ade80] rounded flex items-center justify-center text-[#1a1a1a] font-bold text-sm">
                  A
                </div>
                <span>Letra correta no local certo</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#facc15] rounded flex items-center justify-center text-[#1a1a1a] font-bold text-sm">
                  R
                </div>
                <span>Letra correta no local errado</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2d2d2d] rounded flex items-center justify-center text-[#d0d0d0] font-bold text-sm">
                  T
                </div>
                <span>Letra não está na palavra</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-[#8b5cf6]">Dicas:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Use palavras reais em português</li>
              <li>• Observe as cores para descobrir a palavra</li>
              <li>• Você tem 6 tentativas para acertar</li>
              <li>• Uma nova palavra está disponível todos os dias</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};