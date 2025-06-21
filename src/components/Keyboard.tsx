import React from 'react';
import { Delete } from 'lucide-react';
import { KeyboardKey } from '../types/game';

interface KeyboardProps {
  keyboardStates: KeyboardKey[];
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  keyboardStates,
  onKeyPress,
  onDelete,
  onEnter,
  disabled = false
}) => {
  const keyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'DELETE'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
  ];

  const getKeyState = (key: string) => {
    const keyState = keyboardStates.find(k => k.key === key);
    return keyState?.status || 'unused';
  };

  const getKeyClass = (key: string, keyStatus: string) => {
    const baseClass = "h-14 sm:h-auto sm:py-4 rounded-lg font-mono transition-all duration-200 select-none cursor-pointer flex items-center justify-center";
    
    let widthClass;
    const isSpecial = key === 'ENTER' || key === 'DELETE';

    if (isSpecial) {
      const mobileFlex = key === 'ENTER' ? 'flex-[2]' : 'flex-[1.5]';
      widthClass = `${mobileFlex} px-2 sm:flex-initial sm:px-6 sm:min-w-[100px]`;
    } else {
      widthClass = 'flex-1 px-1 sm:flex-initial sm:px-4 sm:min-w-[60px]';
    }
    
    if (disabled) {
      return `${baseClass} ${widthClass} bg-[#2d2d2d] text-[#d0d0d0]/50 cursor-not-allowed border border-[#3d3d3d]`;
    }

    if (keyStatus === 'correct') {
      return `${baseClass} ${widthClass} bg-[#4ade80] text-[#1a1a1a] border border-[#4ade80] font-bold`;
    } else if (keyStatus === 'present') {
      return `${baseClass} ${widthClass} bg-[#facc15] text-[#1a1a1a] border border-[#facc15] font-bold`;
    } else if (keyStatus === 'absent') {
      return `${baseClass} ${widthClass} bg-gradient-to-br from-gray-600 to-gray-700 text-white border-gray-500 shadow-lg shadow-gray-500/25`;
    } else {
      return `${baseClass} ${widthClass} bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6]`;
    }
  };

  const handleKeyClick = (key: string) => {
    if (disabled) return;
    
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'DELETE') {
      onDelete();
    } else {
      onKeyPress(key);
    }
  };

  // Keyboard event listener
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      
      const key = event.key.toUpperCase();
      
      if (event.key === 'Enter') {
        onEnter();
      } else if (event.key === 'Backspace') {
        onDelete();
      } else if (/^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, onDelete, onEnter, disabled]);

  return (
    <div className="w-full max-w-2xl sm:max-w-4xl mx-auto p-2 sm:p-6 space-y-2 sm:space-y-3">
      {keyRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-2 justify-center">
          {row.map((key) => {
            const keyStatus = getKeyState(key);
            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={getKeyClass(key, keyStatus)}
                disabled={disabled}
              >
                {key === 'DELETE' ? (
                  <Delete className="h-6 w-6 sm:h-5 sm:w-5" />
                ) : (
                  <span className="text-base sm:text-base">{key}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};