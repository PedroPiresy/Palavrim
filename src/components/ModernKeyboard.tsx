import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import { KeyboardKey } from '../types/game';

interface ModernKeyboardProps {
  keyboardStates: KeyboardKey[];
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  disabled?: boolean;
  isVimMode?: boolean;
}

export const ModernKeyboard: React.FC<ModernKeyboardProps> = ({
  keyboardStates,
  onKeyPress,
  onDelete,
  onEnter,
  disabled = false,
  isVimMode = false,
}) => {
  const keyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'DELETE'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
  ];

  const getKeyClass = (key: string, keyStatus: string) => {
    const baseClass = "keyboard-key rounded-xl font-semibold transition-all duration-150 select-none cursor-pointer flex items-center justify-center";
    
    let sizeClass;
    const isSpecial = key === 'ENTER' || key === 'DELETE';

    if (isSpecial) {
      sizeClass = key === 'ENTER' ? 'flex-[2] px-3 h-12' : 'flex-[1.5] px-3 h-12';
    } else {
      sizeClass = 'flex-1 px-2 h-12 min-w-[40px]';
    }
    
    if (disabled) {
      return `${baseClass} ${sizeClass} opacity-50 cursor-not-allowed`;
    }

    let statusClass = '';
    if (keyStatus === 'correct') {
      statusClass = 'correct';
    } else if (keyStatus === 'present') {
      statusClass = 'present';
    } else if (keyStatus === 'absent') {
      statusClass = 'absent';
    }
    
    return `${baseClass} ${sizeClass} ${statusClass}`;
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
      if (disabled || isVimMode) return;
      
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
  }, [onKeyPress, onDelete, onEnter, disabled, isVimMode]);

  // Função utilitária para cor de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'correct';
      case 'present': return 'present';
      case 'absent': return 'absent';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-2">
      {keyRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center">
          {row.map((key) => {
            const keyState = keyboardStates.find(k => k.key === key);
            const keyStatus = keyState?.status || 'unused';
            const isArray = Array.isArray(keyStatus);
            const isSpecial = key === 'ENTER' || key === 'DELETE';
            
            if (disabled) {
              return (
                <button 
                  key={key} 
                  disabled 
                  className={getKeyClass(key, 'unused')}
                >
                  {key === 'DELETE' ? (
                    <Delete className="h-5 w-5" />
                  ) : key === 'ENTER' ? (
                    <CornerDownLeft className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{key}</span>
                  )}
                </button>
              );
            }
            
            // Tecla multicolorida (dueto/quarteto)
            if (isArray && !isSpecial) {
              const arr = keyStatus as string[];
              // Dueto: duas metades
              if (arr.length === 2) {
                return (
                  <button 
                    key={key} 
                    onClick={() => handleKeyClick(key)} 
                    className="keyboard-key rounded-xl font-semibold transition-all duration-150 select-none cursor-pointer flex items-center justify-center flex-1 px-2 h-12 min-w-[40px] p-0 overflow-hidden relative"
                  >
                    {/* Fundo dividido */}
                    <div className="flex w-full h-full absolute inset-0 z-0 rounded-xl overflow-hidden">
                      <div className={`flex-1 h-full ${getStatusColor(arr[0])}`}></div>
                      <div className={`flex-1 h-full ${getStatusColor(arr[1])}`}></div>
                    </div>
                    {/* Letra centralizada */}
                    <span className="relative z-10 text-sm font-semibold w-full flex items-center justify-center h-full">
                      {key}
                    </span>
                  </button>
                );
              }
              // Tetra: quatro quadrantes
              if (arr.length === 4) {
                return (
                  <button 
                    key={key} 
                    onClick={() => handleKeyClick(key)} 
                    className="keyboard-key rounded-xl font-semibold transition-all duration-150 select-none cursor-pointer flex items-center justify-center flex-1 px-2 h-12 min-w-[40px] p-0 overflow-hidden relative"
                  >
                    {/* Fundo dividido */}
                    <div className="grid grid-cols-2 grid-rows-2 w-full h-full absolute inset-0 z-0 rounded-xl overflow-hidden">
                      <div className={`flex items-center justify-center ${getStatusColor(arr[0])}`}></div>
                      <div className={`flex items-center justify-center ${getStatusColor(arr[1])}`}></div>
                      <div className={`flex items-center justify-center ${getStatusColor(arr[2])}`}></div>
                      <div className={`flex items-center justify-center ${getStatusColor(arr[3])}`}></div>
                    </div>
                    {/* Letra centralizada */}
                    <span className="relative z-10 text-sm font-semibold w-full flex items-center justify-center h-full">
                      {key}
                    </span>
                  </button>
                );
              }
            }
            
            // Tecla normal (modo clássico ou especial)
            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={getKeyClass(key, typeof keyStatus === 'string' ? keyStatus : 'unused')}
                disabled={disabled}
              >
                {key === 'DELETE' ? (
                  <Delete className="h-5 w-5" />
                ) : key === 'ENTER' ? (
                  <CornerDownLeft className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{key}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};