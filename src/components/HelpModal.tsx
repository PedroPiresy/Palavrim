import React from 'react';
import { X, Star, Zap, Trophy, Wand2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  startTour: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, startTour }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#d0d0d0] font-mono">Como Jogar</h2>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-[#d0d0d0] font-mono">
          <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-purple-200 text-center sm:text-left">Novo por aqui? Faça um tour guiado pelas novidades!</p>
            <button
              onClick={() => {
                onClose();
                setTimeout(startTour, 300); // Dá tempo para o modal fechar
              }}
              className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
            >
              <Wand2 size={18} />
              Fazer Tour Guiado
            </button>
          </div>
        
          {/* Como Jogar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2">
              <Trophy size={20} />
              Como Jogar
            </h3>
            <p>
              Descubra a palavra secreta em até 6 tentativas!
            </p>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-[#8b5cf6]">Como funciona:</h4>
              
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
              <h4 className="font-semibold text-[#8b5cf6]">Dicas:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Use palavras reais em português</li>
                <li>• Observe as cores para descobrir a palavra</li>
                <li>• Você tem 6 tentativas para acertar</li>
                <li>• Uma nova palavra está disponível todos os dias</li>
              </ul>
            </div>
          </div>

          {/* Sistema de Evolução */}
          <div className="space-y-4 border-t border-[#3d3d3d] pt-6">
            <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2">
              <Star size={20} />
              Sistema de Evolução
            </h3>
            
            <div className="space-y-3">
              <p className="text-sm">
                Ganhe <span className="text-[#facc15] font-bold">XP (Pontos de Experiência)</span> ao vencer e evolua através de 8 ranks mágicos!
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-[#8b5cf6]">Como ganhar XP:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <span className="text-[#4ade80] font-bold">1 tentativa:</span> 150 XP
                  </div>
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <span className="text-[#4ade80] font-bold">2 tentativas:</span> 130 XP
                  </div>
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <span className="text-[#4ade80] font-bold">3 tentativas:</span> 110 XP
                  </div>
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <span className="text-[#4ade80] font-bold">4 tentativas:</span> 90 XP
                  </div>
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <span className="text-[#4ade80] font-bold">5 tentativas:</span> 70 XP
                  </div>
                  <div className="bg-[#2d2d2d] p-2 rounded">
                    <span className="text-[#4ade80] font-bold">6 tentativas:</span> 50 XP
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-[#8b5cf6]">Ranks Disponíveis:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>🥉 Aprendiz de Letras</span>
                    <span className="text-gray-400">Níveis 1-4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥈 Iniciado das Sílabas</span>
                    <span className="text-gray-400">Níveis 5-9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥇 Mago das Palavras</span>
                    <span className="text-gray-400">Níveis 10-14</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💫 Feiticeiro Ortográfico</span>
                    <span className="text-gray-400">Níveis 15-19</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🌟 Arquimago do Dicionário</span>
                    <span className="text-gray-400">Níveis 20-24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>👑 Lorde do Léxico</span>
                    <span className="text-gray-400">Níveis 25-29</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚡ Semideus da Semântica</span>
                    <span className="text-gray-400">Níveis 30-39</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔥 Avatar do Alfabeto</span>
                    <span className="text-gray-400">Nível 40+</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-[#8b5cf6] flex items-center gap-2">
                  <Zap size={16} />
                  Mana
                </h4>
                <p className="text-sm">
                  Você começa com <span className="text-[#fbbf24] font-bold">100 de Mana</span>. 
                  Em breve, poderá usar feitiços especiais que consomem mana para obter dicas mágicas!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};