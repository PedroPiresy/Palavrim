import React from 'react';
import { X, Github, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-lg w-full max-h-[90vh] overflow-y-auto font-mono">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Github size={22} className="text-purple-400" />
            Sobre o Projeto
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 text-[#d0d0d0]">
          <div className="text-center space-y-2">
            <img 
              src="/assets/images/Palavrim.png" 
              alt="Ícone Palavrim"
              className="w-16 h-16 mx-auto mb-4"
            />
            <p className="text-base">
              Palavrim é um jogo de palavras mágico, inspirado no clássico Wordle, mas com uma pitada de feitiçaria e evolução de personagem.
            </p>
            <p className="text-sm text-gray-400">
              Este projeto foi desenvolvido com tecnologias modernas como React, TypeScript e Tailwind CSS.
            </p>
          </div>

          <div className="border-t border-[#3d3d3d] pt-6 flex flex-col items-center text-center">
            <p className="flex items-center gap-2 mb-4">
              <Heart size={16} className="text-red-500 animate-pulse" />
              <span>Criado por Pedro Pires</span>
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <a 
                href="https://github.com/PedroPiresy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-purple-300 hover:text-white transition-colors bg-purple-900/50 hover:bg-purple-800/70 border border-purple-700 hover:border-purple-600 px-4 py-2 rounded-lg"
              >
                <Github size={16} />
                Visite meu perfil no GitHub
              </a>
              <a 
                href="https://github.com/PedroPiresy/Palavrim" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-purple-300 hover:text-white transition-colors bg-purple-900/50 hover:bg-purple-800/70 border border-purple-700 hover:border-purple-600 px-4 py-2 rounded-lg"
              >
                <Github size={16} />
                Veja o repositório do projeto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 