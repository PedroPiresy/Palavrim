import React from 'react';

interface CountdownProps {
  count: number;
}

export const Countdown: React.FC<CountdownProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
      <div key={count} className="text-white font-mono font-bold text-9xl animate-countdown-zoom">
        {count}
      </div>
      <style>
        {`
          @keyframes countdown-zoom {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          .animate-countdown-zoom {
            animation: countdown-zoom 1s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}; 