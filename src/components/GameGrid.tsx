import React, { useRef, useEffect } from 'react';
import { LetterState } from '../types/game';
import { Timer } from './Timer';

interface GameGridProps {
  guesses: string[];
  currentGuess: string[];
  wordLength: number;
  maxAttempts: number;
  getLetterStates: (guess: string) => LetterState[];
  isCompleted: boolean;
  selectedIndex: number;
  selectIndex: (index: number) => void;
  isSpeedRun?: boolean;
  isSpeedRunActive?: boolean;
  onTimeUpdate?: (time: number) => void;
  isLastAttempt?: boolean;
  shouldExplode?: boolean;
}

export const GameGrid: React.FC<GameGridProps> = ({
  guesses,
  currentGuess,
  wordLength,
  maxAttempts,
  getLetterStates,
  isCompleted,
  selectedIndex,
  selectIndex,
  isSpeedRun = false,
  isSpeedRunActive = false,
  onTimeUpdate,
  isLastAttempt = false,
  shouldExplode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito para manter o foco no grid
  useEffect(() => {
    const gridElement = containerRef.current;
    if (gridElement) {
      gridElement.focus();
      
      // Refocar o grid quando clicar em qualquer lugar da página
      const handleClick = () => {
        if (document.activeElement !== gridElement) {
          gridElement.focus();
        }
      };
      
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, []);

  const getRowData = (rowIndex: number) => {
    if (rowIndex < guesses.length) {
      // Linha com palpite confirmado
      return getLetterStates(guesses[rowIndex]);
    } else if (rowIndex === guesses.length) {
      // Linha atual
      const currentLetters = currentGuess.map(letter => ({
        letter,
        status: 'empty' as const
      }));
      // currentGuess já tem o tamanho correto
      return currentLetters;
    } else {
      // Linhas vazias
      return Array(wordLength).fill(0).map(() => ({
        letter: '',
        status: 'empty' as const
      }));
    }
  };

  const getCellClass = (status: string, isCurrentRow: boolean, isSelected: boolean) => {
    const baseClass = "w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-300 transform";
    let extra = '';
    if (isSelected) {
      extra = ' ring-2 sm:ring-4 ring-purple-400 border-2 border-purple-500';
    }
    if (status === 'correct') {
      return `${baseClass} bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white shadow-lg shadow-green-500/25 animate-flip`;
    } else if (status === 'present') {
      return `${baseClass} bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400 text-white shadow-lg shadow-yellow-500/25 animate-flip`;
    } else if (status === 'absent') {
      return `${baseClass} bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500 text-white shadow-lg shadow-gray-500/25 animate-flip`;
    } else if (isCurrentRow && status === 'empty') {
      return `${baseClass} bg-slate-800/50 border-purple-600/50 text-white hover:border-purple-500 hover:bg-slate-700/50${extra}`;
    } else {
      return `${baseClass} bg-slate-800/30 border-slate-700/50 text-slate-400`;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isCompleted) return;
    if (document.activeElement !== e.currentTarget) return;
    
    if (e.key === 'ArrowLeft') {
      selectIndex(Math.max(selectedIndex - 1, 0));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      selectIndex(Math.min(selectedIndex + 1, wordLength - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Mantém o foco no grid quando usar as setas
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto">
      {/* Cronômetro do Speed Run */}
      {isSpeedRun && (
        <div className="w-full flex justify-center">
          <Timer 
            isRunning={isSpeedRunActive} 
            onTimeUpdate={onTimeUpdate}
            className="bg-[#2d2d2d] px-3 py-2 sm:px-6 sm:py-3 rounded-lg border border-[#3d3d3d] text-sm sm:text-base"
          />
        </div>
      )}
      
      <div
        ref={containerRef}
        className={`grid-componente flex flex-col gap-1 sm:gap-2 p-2 sm:p-6 ${isCompleted ? 'grid-completed' : ''} outline-none focus:ring-2 focus:ring-purple-500 rounded-lg w-full`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Grade do jogo"
        role="grid"
      >
        {Array(maxAttempts).fill(0).map((_, rowIndex) => {
          const rowData = getRowData(rowIndex);
          const isCurrentRow = rowIndex === guesses.length;
          
          return (
            <div key={rowIndex} className="flex gap-1 sm:gap-2 justify-center items-center">
              {/* Mostra a caveira na última tentativa */}
              {isLastAttempt && isCurrentRow && (
                <div className="w-6 sm:w-8 h-12 sm:h-14 flex items-center justify-center">
                  {shouldExplode ? (
                    <div className="relative">
                      {/* Explosão da caveira */}
                      <div className="absolute inset-0 animate-explode">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-explosion-core"></div>
                      </div>
                      {/* Partículas da explosão */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-explosion-particle"
                          style={{
                            '--particle-angle': `${i * 45}deg`,
                            '--particle-delay': `${i * 0.1}s`
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <span className="text-2xl sm:text-3xl text-red-500">💀</span>
                    </div>
                  )}
                </div>
              )}

              {rowData.map((cell, cellIndex) => {
                const isSelected = isCurrentRow && cellIndex === selectedIndex;
                return (
                  <div
                    key={cellIndex}
                    className={getCellClass(cell.status, isCurrentRow, isSelected)}
                    style={{
                      animationDelay: rowIndex < guesses.length ? `${cellIndex * 100}ms` : '0ms'
                    }}
                    onClick={isCurrentRow ? () => {
                      selectIndex(cellIndex);
                      containerRef.current?.focus();
                    } : undefined}
                    tabIndex={isCurrentRow ? 0 : -1}
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={`Célula ${cellIndex + 1} da linha ${rowIndex + 1}${cell.letter ? `: ${cell.letter}` : ''}`}
                  >
                    {cell.letter}
                  </div>
                );
              })}

              {/* Espaço para a caveira do outro lado para manter o grid centrado */}
              {isLastAttempt && isCurrentRow && (
                <div className="w-6 sm:w-8"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// CSS for animations
const styles = `
@keyframes explode {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes explosion-core {
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(0); }
}

@keyframes explosion-particle {
  0% { 
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% { 
    transform: translate(
      calc(cos(var(--particle-angle)) * 50px),
      calc(sin(var(--particle-angle)) * 50px)
    ) scale(0);
    opacity: 0;
  }
}

.animate-explode {
  animation: explode 0.8s ease-out forwards;
}

.animate-explosion-core {
  animation: explosion-core 0.8s ease-out forwards;
}

.animate-explosion-particle {
  animation: explosion-particle 0.8s ease-out forwards;
  animation-delay: var(--particle-delay);
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);