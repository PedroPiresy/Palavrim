import React from 'react';

interface MascotProps {
  message: string;
  isCastingSpell?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ message, isCastingSpell = false }) => {
  return (
    <div className="fixed bottom-20 right-8 flex flex-col items-center gap-2 z-20">
      <div className="bg-[#2d2d2d] border-2 border-purple-600 p-3 rounded-lg rounded-br-none shadow-lg max-w-xs animate-fade-in">
        <p className="text-sm text-purple-200 font-mono text-center">
          {message}
        </p>
      </div>
      <img 
        src="/assets/images/Palavrim.png" 
        alt="Mascote Mago"
        className={`w-20 h-20 ${isCastingSpell ? 'animate-cast-spell' : ''}`}
      />
      
      {/* Feitiço voando */}
      {isCastingSpell && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div className="absolute bottom-20 right-8 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-spell-flight shadow-lg shadow-purple-400/50"></div>
        </div>
      )}
    </div>
  );
};

// CSS for animations
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes cast-spell {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  50% { transform: scale(1.2) rotate(5deg); }
  75% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes spell-flight {
  0% { 
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-200px, -100px) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translate(-400px, -200px) scale(0.5);
    opacity: 0;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-cast-spell {
  animation: cast-spell 1s ease-in-out;
}

.animate-spell-flight {
  animation: spell-flight 1s ease-out forwards;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet); 