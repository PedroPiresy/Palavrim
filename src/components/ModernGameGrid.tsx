import React, { useRef, useEffect } from 'react';
import { LetterState } from '../types/game';
import { Timer } from './Timer';

interface ModernGameGridProps {
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

export const ModernGameGrid: React.FC<ModernGameGridProps> = ({
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

  useEffect(() => {
    const gridElement = containerRef.current;
    if (gridElement) {
      gridElement.focus();
      
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
      return getLetterStates(guesses[rowIndex]);
    } else if (rowIndex === guesses.length) {
      const currentLetters = currentGuess.map(letter => ({
        letter,
        status: 'empty' as const
      }));
      return currentLetters;
    } else {
      return Array(wordLength).fill(0).map(() => ({
        letter: '',
        status: 'empty' as const
      }));
    }
  };

  const getCellClass = (status: string, isCurrentRow: boolean, isSelected: boolean) => {
    let baseClass = "game-cell w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold";
    
    if (isSelected && isCurrentRow) {
      baseClass += " selected";
    }
    
    if (status === 'correct') {
      baseClass += " correct animate-flip";
    } else if (status === 'present') {
      baseClass += " present animate-flip";
    } else if (status === 'absent') {
      baseClass += " absent animate-flip";
    } else if (isCurrentRow && status === 'empty') {
      baseClass += " hover:border-[var(--border-secondary)]";
    }
    
    return baseClass;
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
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {isSpeedRun && (
        <div className="card px-6 py-3 rounded-xl">
          <Timer 
            isRunning={isSpeedRunActive} 
            onTimeUpdate={onTimeUpdate}
            className="text-[var(--accent-blue)] font-mono font-bold text-xl"
          />
        </div>
      )}
      
      <div
        ref={containerRef}
        className={`flex flex-col gap-2 p-6 rounded-2xl card ${isCompleted ? 'opacity-75' : ''} outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-opacity-50`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Grade do jogo"
        role="grid"
      >
        {Array(maxAttempts).fill(0).map((_, rowIndex) => {
          const rowData = getRowData(rowIndex);
          const isCurrentRow = rowIndex === guesses.length;
          
          return (
            <div key={rowIndex} className="flex gap-2 justify-center items-center relative">
              {isLastAttempt && isCurrentRow && (
                <div className="absolute -left-12 flex items-center justify-center">
                  {shouldExplode ? (
                    <div className="relative">
                      <div className="absolute inset-0 animate-pulse">
                        <div className="w-8 h-8 bg-gradient-to-r from-[var(--error)] to-[var(--warning)] rounded-full"></div>
                      </div>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-gradient-to-r from-[var(--error)] to-[var(--warning)] rounded-full animate-bounce"
                          style={{
                            '--particle-angle': `${i * 45}deg`,
                            '--particle-delay': `${i * 0.1}s`
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <span className="text-3xl">💀</span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};