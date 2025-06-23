import React from 'react';
import { LetterState } from '../types/game';

interface TetraGridProps {
  guesses: string[];
  currentGuess: string[];
  wordLength: number;
  maxAttempts: number;
  getLetterStates: (guess: string) => LetterState[];
  isCompleted: boolean;
  status: 'playing' | 'won' | 'lost';
  title: string;
  gridNumber: number;
  selectedIndex: number;
  selectIndex: (index: number) => void;
  isLastAttempt?: boolean;
}

export const TetraGrid: React.FC<TetraGridProps> = ({
  guesses,
  currentGuess,
  wordLength,
  maxAttempts,
  getLetterStates,
  isCompleted,
  status,
  title,
  gridNumber,
  selectedIndex,
  selectIndex,
  isLastAttempt = false,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
      while (currentLetters.length < wordLength) {
        currentLetters.push({ letter: '', status: 'empty' as const });
      }
      return currentLetters;
    } else {
      return Array(wordLength).fill(0).map(() => ({
        letter: '',
        status: 'empty' as const
      }));
    }
  };

  const getCellClass = (status: string, isCurrentRow: boolean) => {
    const baseClass = "w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 border-2 rounded-md flex items-center justify-center text-xs sm:text-sm md:text-base font-bold transition-all duration-300";
    
    if (status === 'correct') {
      return `${baseClass} bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white shadow-lg shadow-green-500/25 animate-flip`;
    } else if (status === 'present') {
      return `${baseClass} bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400 text-white shadow-lg shadow-yellow-500/25 animate-flip`;
    } else if (status === 'absent') {
      return `${baseClass} bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500 text-white shadow-lg shadow-gray-500/25 animate-flip`;
    } else if (isCurrentRow && status === 'empty') {
      return `${baseClass} bg-slate-800/50 border-purple-600/50 text-white hover:border-purple-500 hover:bg-slate-700/50`;
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
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 w-full mx-auto">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`grid-componente flex flex-col gap-1 p-1 sm:p-2 ${isCompleted ? 'opacity-75' : ''} rounded-lg w-full`}
        role="grid"
      >
        {Array(maxAttempts).fill(0).map((_, rowIndex) => {
          const rowData = getRowData(rowIndex);
          const isCurrentRow = rowIndex === guesses.length && !isCompleted;
          return (
            <div key={rowIndex} className="relative flex gap-1 justify-center items-center">
              {isLastAttempt && isCurrentRow && (
                <div className="absolute left-[-32px] sm:left-[-40px] flex items-center justify-center animate-pulse" style={{height: '100%'}}>
                  <span className="text-2xl sm:text-3xl text-red-500">💀</span>
                </div>
              )}
              {rowData.map((cell, cellIndex) => {
                const isSelected = isCurrentRow && cellIndex === selectedIndex;
                return (
                  <div
                    key={cellIndex}
                    className={getCellClass(cell.status, isCurrentRow) + (isSelected ? ' ring-2 ring-purple-400 border-2 border-purple-500' : '')}
                    style={{
                      animationDelay: rowIndex < guesses.length ? `${cellIndex * 100}ms` : '0ms'
                    }}
                    onClick={isCurrentRow ? () => selectIndex(cellIndex) : undefined}
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