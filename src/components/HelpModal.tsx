import React from 'react';
import { X, Star, Zap, Trophy, Wand2, Clock, Sparkles, Home, Play, BookOpen } from 'lucide-react';

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

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  startTour: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, startTour }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#3d3d3d] max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 bg-[#2d2d2d] border-b border-[#3d3d3d] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#d0d0d0] font-mono">Como Jogar</h2>
          <button
            onClick={onClose}
            className="p-2 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 text-[#d0d0d0] font-mono">
          <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-purple-200 text-center sm:text-left">Novo por aqui? Faça um tour guiado pelas novidades!</p>
            <button
              onClick={() => {
                onClose();
                setTimeout(startTour, 300); // Dá tempo para o modal fechar
              }}
              className="hidden sm:flex flex-shrink-0 w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
            >
              <Wand2 size={18} />
              Fazer Tour Guiado
            </button>
          </div>
        
          {/* Como Jogar Básico */}
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

          {/* Modos de Jogo */}
          <div className="space-y-4 border-t border-[#3d3d3d] pt-6">
            <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2">
              <Play size={20} />
              Modos de Jogo
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Modo Normal */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <div className="flex items-center gap-2 mb-3">
                  <Home size={18} className="text-[#4ade80]" />
                  <h4 className="font-semibold text-[#4ade80]">Modo Normal</h4>
                </div>
                <p className="text-sm mb-2">O modo clássico do Palavrim</p>
                <ul className="text-xs space-y-1">
                  <li>• 1 palavra para descobrir</li>
                  <li>• 6 tentativas</li>
                  <li>• Feitiços disponíveis</li>
                  <li>• Mascote interativo</li>
                </ul>
              </div>

              {/* Modo Abracadupla */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <div className="flex items-center gap-2 mb-3">
                  <DuetoIcon size={18} className="text-[#facc15]" />
                  <h4 className="font-semibold text-[#facc15]">Abracadupla</h4>
                </div>
                <p className="text-sm mb-2">Desafio duplo para magos experientes</p>
                <ul className="text-xs space-y-1">
                  <li>• 2 palavras simultâneas</li>
                  <li>• 7 tentativas</li>
                  <li>• Cada palpite testa ambas</li>
                  <li>• Estratégia avançada</li>
                </ul>
              </div>

              {/* Modo Abracatetra */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <div className="flex items-center gap-2 mb-3">
                  <TetraIcon size={18} className="text-[#ef4444]" />
                  <h4 className="font-semibold text-[#ef4444]">Abracatetra</h4>
                </div>
                <p className="text-sm mb-2">O teste supremo dos magos</p>
                <ul className="text-xs space-y-1">
                  <li>• 4 palavras simultâneas</li>
                  <li>• 9 tentativas</li>
                  <li>• Máximo desafio</li>
                  <li>• Para mestres experientes</li>
                </ul>
              </div>

              {/* Modo Speed Run */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-[#8b5cf6]" />
                  <h4 className="font-semibold text-[#8b5cf6]">Modo Mágico</h4>
                </div>
                <p className="text-sm mb-2">Contra o tempo!</p>
                <ul className="text-xs space-y-1">
                  <li>• Cronômetro ativo</li>
                  <li>• 6 tentativas</li>
                  <li>• Bata seu recorde</li>
                  <li>• Palavra aleatória</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sistema de Feitiços */}
          <div className="space-y-4 border-t border-[#3d3d3d] pt-6">
            <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2">
              <BookOpen size={20} />
              Livro de Feitiços
            </h3>
            
            <div className="space-y-3">
              <p className="text-sm">
                No modo normal, você tem acesso ao seu <span className="text-[#fbbf24] font-bold">Livro de Feitiços</span>!
              </p>
              
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-[#8b5cf6]" />
                  <h4 className="font-semibold text-[#8b5cf6]">Feitiço: Revelar Letra</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• <span className="text-[#fbbf24] font-bold">Custo:</span> 25 de Mana</li>
                  <li>• <span className="text-[#fbbf24] font-bold">Limite:</span> 2 usos por partida</li>
                  <li>• Revela uma letra correta no grid</li>
                  <li>• Útil quando você está empacado</li>
                </ul>
              </div>
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
                  Ganhe +15 de Mana diariamente e +50 ao subir de nível!
                </p>
              </div>
            </div>
          </div>

          {/* Recursos Especiais */}
          <div className="space-y-4 border-t border-[#3d3d3d] pt-6">
            <h3 className="text-lg font-semibold text-[#8b5cf6] flex items-center gap-2">
              <Wand2 size={20} />
              Recursos Especiais
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Mascote */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <h4 className="font-semibold text-[#8b5cf6] mb-2">Mascote Mágico</h4>
                <p className="text-sm">
                  Um mago sábio (e às vezes sarcástico) que te acompanha durante o jogo, 
                  dando dicas e comentários sobre seu desempenho.
                </p>
              </div>

              {/* Estatísticas */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <h4 className="font-semibold text-[#8b5cf6] mb-2">Painel de Estatísticas</h4>
                <p className="text-sm">
                  Acompanhe seu progresso com gráficos detalhados, 
                  sequências de vitórias e análise de letras mais usadas.
                </p>
              </div>

              {/* Animações */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d]">
                <h4 className="font-semibold text-[#8b5cf6] mb-2">Animações Mágicas</h4>
                <p className="text-sm">
                  Feitiços voando, explosões épicas na última tentativa 
                  e outras animações que tornam o jogo mais imersivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};