import React, { useRef, useEffect } from 'react';
import { LetterState } from '../types/game';

interface GameGridProps {
  guesses: string[];
  currentGuess: string[];
  wordLength: number;
  maxAttempts: number;
  getLetterStates: (guess: string) => LetterState[];
  isCompleted: boolean;
  selectedIndex: number;
  selectIndex: (index: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  guesses,
  currentGuess,
  wordLength,
  maxAttempts,
  getLetterStates,
  isCompleted,
  selectedIndex,
  selectIndex
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
    const baseClass = "w-14 h-14 border-2 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 transform";
    let extra = '';
    if (isSelected) {
      extra = ' ring-4 ring-purple-400 border-2 border-purple-500';
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
    <div
      ref={containerRef}
      className={`grid-componente flex flex-col gap-2 p-6 ${isCompleted ? 'grid-completed' : ''} outline-none focus:ring-2 focus:ring-purple-500 rounded-lg`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Grade do jogo"
      role="grid"
    >
      {Array(maxAttempts).fill(0).map((_, rowIndex) => {
        const rowData = getRowData(rowIndex);
        const isCurrentRow = rowIndex === guesses.length;
        
        return (
          <div key={rowIndex} className="flex gap-2 justify-center">
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
  );
};