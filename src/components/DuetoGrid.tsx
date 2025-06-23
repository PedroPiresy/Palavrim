import React, { useRef, useEffect } from 'react';
import { LetterState } from '../types/game';

interface DuetoGridProps {
  guesses: string[];
  currentGuess: string[];
  wordLength: number;
  maxAttempts: number;
  getLetterStates: (guess: string) => LetterState[];
  isCompleted: boolean;
  status: 'playing' | 'won' | 'lost';
  title: string;
  gridNumber: number;
  selectedIndex?: number;
  selectIndex?: (index: number) => void;
}

export const DuetoGrid: React.FC<DuetoGridProps> = ({
  guesses,
  currentGuess,
  wordLength,
  maxAttempts,
  getLetterStates,
  isCompleted,
  status,
  title,
  gridNumber,
  selectedIndex = 0,
  selectIndex = () => {},
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

  const displayedGuesses = React.useMemo(() => {
    if (status === 'won') {
      const winningGuessIndex = guesses.findIndex(guess => 
        getLetterStates(guess).every(s => s.status === 'correct')
      );
      if (winningGuessIndex !== -1) {
        return guesses.slice(0, winningGuessIndex + 1);
      }
    }
    return guesses;
  }, [guesses, status, getLetterStates]);

  const getRowData = (rowIndex: number) => {
    if (rowIndex < displayedGuesses.length) {
      return getLetterStates(displayedGuesses[rowIndex]);
    } else if (rowIndex === guesses.length && !isCompleted) {
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
    const baseClass = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 rounded-lg flex items-center justify-center text-sm sm:text-base md:text-xl font-bold transition-all duration-300";
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
    <div className="flex flex-col items-center gap-1 sm:gap-2 w-full max-w-xs mx-auto">
      <div 
        ref={containerRef}
        className={`grid-componente flex flex-col gap-1 sm:gap-2 p-2 sm:p-4 ${isCompleted ? 'opacity-75' : ''} rounded-lg w-full outline-none focus:ring-2 focus:ring-purple-500`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Grade ${gridNumber} do jogo`}
        role="grid"
      >
        {Array(maxAttempts).fill(0).map((_, rowIndex) => {
          const rowData = getRowData(rowIndex);
          const isCurrentRow = rowIndex === guesses.length && !isCompleted;
          
          return (
            <div key={rowIndex} className="flex gap-1 sm:gap-2 justify-center">
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