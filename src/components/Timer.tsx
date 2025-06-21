import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ isRunning, onTimeUpdate, className = '' }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: number | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 10; // Atualiza a cada 10ms para precisão
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center justify-center gap-1 sm:gap-2 text-[#8b5cf6] font-mono font-bold ${className}`}>
      <Clock size={16} className="sm:w-5 sm:h-5" />
      <span className="text-lg sm:text-xl">{formatTime(time)}</span>
    </div>
  );
};