import React from 'react';
import { LetterState } from '../types/game';

interface DuetoGridProps {
  guesses: string[];
  currentGuess: string;
  wordLength: number;
  maxAttempts: number;
  getLetterStates: (guess: string) => LetterState[];
  isCompleted: boolean;
  title: string;
  gridNumber: number;
}

export const DuetoGrid: React.FC<DuetoGridProps> = ({
  guesses,
  currentGuess,
  wordLength,
  maxAttempts,
  getLetterStates,
  isCompleted,
  title,
  gridNumber,
}) => {
  const getRowData = (rowIndex: number) => {
    if (rowIndex < guesses.length) {
      return getLetterStates(guesses[rowIndex]);
    } else if (rowIndex === guesses.length) {
      const currentLetters = currentGuess.split('').map(letter => ({
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
    const baseClass = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 rounded-lg flex items-center justify-center text-sm sm:text-base md:text-xl font-bold transition-all duration-300";
    
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

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 w-full max-w-xs mx-auto">
      {/* Título do grid */}
      <div className="text-center mb-1 sm:mb-2">
        <h3 className="text-xs sm:text-sm font-bold text-purple-300 font-mono">
          {title} #{gridNumber}
        </h3>
        {isCompleted && (
          <div className="text-xs text-green-400 font-mono">✓ Completo</div>
        )}
      </div>
      
      <div className={`flex flex-col gap-1 sm:gap-2 p-2 sm:p-4 ${isCompleted ? 'opacity-75' : ''} rounded-lg w-full`}>
        {Array(maxAttempts).fill(0).map((_, rowIndex) => {
          const rowData = getRowData(rowIndex);
          const isCurrentRow = rowIndex === guesses.length;
          
          return (
            <div key={rowIndex} className="flex gap-1 sm:gap-2 justify-center">
              {rowData.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={getCellClass(cell.status, isCurrentRow)}
                  style={{
                    animationDelay: rowIndex < guesses.length ? `${cellIndex * 100}ms` : '0ms'
                  }}
                >
                  {cell.letter}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};