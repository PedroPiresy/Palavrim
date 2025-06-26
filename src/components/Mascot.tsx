import React, { useState, useEffect } from 'react';

interface MascotProps {
  message: string;
  isCastingSpell?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ message, isCastingSpell = false }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFloating, setIsFloating] = useState(true);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Efeito de piscar aleatório
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% de chance de piscar
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000 + Math.random() * 3000); // Entre 2-5 segundos

    return () => clearInterval(blinkInterval);
  }, []);

  // Gerar partículas mágicas ao redor do mascote
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50, // -50px a +50px
        y: Math.random() * 100 - 50,
        delay: Math.random() * 2000, // 0-2s delay
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const sparkleInterval = setInterval(generateSparkles, 4000);

    return () => clearInterval(sparkleInterval);
  }, []);

  // Parar flutuação durante feitiço
  useEffect(() => {
    if (isCastingSpell) {
      setIsFloating(false);
      setTimeout(() => setIsFloating(true), 1000);
    }
  }, [isCastingSpell]);

  return (
    <div className="hidden sm:flex fixed bottom-16 sm:bottom-20 right-4 sm:right-8 flex-col items-center gap-1 sm:gap-2 z-20">
      {/* Balão de fala melhorado */}
      <div className="relative bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] border-2 border-purple-600 p-2 sm:p-3 rounded-lg rounded-br-none shadow-xl max-w-[200px] sm:max-w-xs animate-fade-in-bounce backdrop-blur-sm">
        {/* Brilho interno do balão */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg rounded-br-none pointer-events-none"></div>
        
        {/* Texto da mensagem */}
        <p className="relative text-xs sm:text-sm text-purple-200 font-mono text-center leading-relaxed">
          {message}
        </p>
        
        {/* Indicador de digitação quando não há mensagem */}
        {!message && (
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-typing-dot"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-typing-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-typing-dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {/* Pequenos detalhes mágicos no balão */}
        <div className="absolute top-1 right-1 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Container do mascote com efeitos */}
      <div className="relative">
        {/* Aura mágica ao redor do mascote */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-pulse-slow"></div>
        
        {/* Círculo de energia */}
        <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-1 border border-cyan-400/20 rounded-full animate-spin-reverse"></div>

        {/* Mascote principal */}
        <img 
          src="/assets/images/Palavrim.png" 
          alt="Mascote Mago"
          className={`relative w-12 h-12 sm:w-20 sm:h-20 z-10 transition-all duration-300 ${
            isFloating ? 'animate-float-gentle' : ''
          } ${
            isCastingSpell ? 'animate-cast-spell-enhanced' : ''
          } ${
            isBlinking ? 'animate-blink' : ''
          }`}
        />

        {/* Partículas mágicas ao redor */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-sparkle pointer-events-none"
            style={{
              left: `50%`,
              top: `50%`,
              transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
              animationDelay: `${sparkle.delay}ms`,
            }}
          />
        ))}

        {/* Efeito de energia no chão */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent rounded-full animate-energy-pulse"></div>
      </div>
      
      {/* Feitiço voando melhorado */}
      {isCastingSpell && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {/* Feitiço principal */}
          <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-8 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full animate-spell-flight-enhanced shadow-lg">
            {/* Rastro do feitiço */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-spell-trail"></div>
          </div>
          
          {/* Partículas do feitiço */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-16 sm:bottom-20 right-4 sm:right-8 w-1 h-1 bg-purple-300 rounded-full animate-spell-particles"
              style={{
                animationDelay: `${i * 0.1}s`,
                '--particle-angle': `${i * 45}deg`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// CSS para todas as animações
const styles = `
/* Animação de entrada do balão */
@keyframes fade-in-bounce {
  0% { 
    opacity: 0; 
    transform: translateY(20px) scale(0.8); 
  }
  60% { 
    opacity: 1; 
    transform: translateY(-5px) scale(1.05); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

/* Flutuação suave do mascote */
@keyframes float-gentle {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  25% { 
    transform: translateY(-3px) rotate(1deg); 
  }
  50% { 
    transform: translateY(-6px) rotate(0deg); 
  }
  75% { 
    transform: translateY(-3px) rotate(-1deg); 
  }
}

/* Animação de lançar feitiço melhorada */
@keyframes cast-spell-enhanced {
  0% { 
    transform: scale(1) rotate(0deg); 
    filter: brightness(1) drop-shadow(0 0 0 transparent);
  }
  20% { 
    transform: scale(1.1) rotate(-3deg); 
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
  }
  40% { 
    transform: scale(1.2) rotate(3deg); 
    filter: brightness(1.4) drop-shadow(0 0 15px rgba(139, 92, 246, 0.7));
  }
  60% { 
    transform: scale(1.15) rotate(-2deg); 
    filter: brightness(1.3) drop-shadow(0 0 12px rgba(139, 92, 246, 0.6));
  }
  80% { 
    transform: scale(1.05) rotate(1deg); 
    filter: brightness(1.1) drop-shadow(0 0 8px rgba(139, 92, 246, 0.4));
  }
  100% { 
    transform: scale(1) rotate(0deg); 
    filter: brightness(1) drop-shadow(0 0 0 transparent);
  }
}

/* Animação de piscar */
@keyframes blink {
  0%, 90%, 100% { 
    filter: brightness(1); 
  }
  95% { 
    filter: brightness(0.7) contrast(1.2); 
  }
}

/* Rotação lenta da aura */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Rotação reversa */
@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Pulso lento da aura */
@keyframes pulse-slow {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.6; 
    transform: scale(1.1); 
  }
}

/* Partículas mágicas */
@keyframes sparkle {
  0% { 
    opacity: 0; 
    transform: scale(0) rotate(0deg); 
  }
  20% { 
    opacity: 1; 
    transform: scale(1) rotate(90deg); 
  }
  80% { 
    opacity: 1; 
    transform: scale(1) rotate(270deg); 
  }
  100% { 
    opacity: 0; 
    transform: scale(0) rotate(360deg); 
  }
}

/* Energia no chão */
@keyframes energy-pulse {
  0%, 100% { 
    opacity: 0.3; 
    transform: scaleX(1); 
  }
  50% { 
    opacity: 0.8; 
    transform: scaleX(1.5); 
  }
}

/* Feitiço voando melhorado */
@keyframes spell-flight-enhanced {
  0% { 
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
  }
  25% {
    transform: translate(-100px, -50px) scale(1.2) rotate(90deg);
    opacity: 0.9;
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.9);
  }
  50% {
    transform: translate(-200px, -100px) scale(1.4) rotate(180deg);
    opacity: 0.8;
    box-shadow: 0 0 20px rgba(139, 92, 246, 1);
  }
  75% {
    transform: translate(-300px, -150px) scale(1.2) rotate(270deg);
    opacity: 0.6;
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.7);
  }
  100% {
    transform: translate(-400px, -200px) scale(0.5) rotate(360deg);
    opacity: 0;
    box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
  }
}

/* Rastro do feitiço */
@keyframes spell-trail {
  0% { 
    transform: scale(1); 
    opacity: 0.8; 
  }
  50% { 
    transform: scale(1.5); 
    opacity: 0.4; 
  }
  100% { 
    transform: scale(2); 
    opacity: 0; 
  }
}

/* Partículas do feitiço */
@keyframes spell-particles {
  0% { 
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% { 
    transform: translate(
      calc(cos(var(--particle-angle)) * 80px),
      calc(sin(var(--particle-angle)) * 80px)
    ) scale(0);
    opacity: 0;
  }
}

/* Indicador de digitação */
@keyframes typing-dot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Classes CSS */
.animate-fade-in-bounce {
  animation: fade-in-bounce 0.6s ease-out forwards;
}

.animate-float-gentle {
  animation: float-gentle 4s ease-in-out infinite;
}

.animate-cast-spell-enhanced {
  animation: cast-spell-enhanced 1.2s ease-in-out;
}

.animate-blink {
  animation: blink 0.15s ease-in-out;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 6s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-sparkle {
  animation: sparkle 3s ease-in-out infinite;
}

.animate-energy-pulse {
  animation: energy-pulse 2s ease-in-out infinite;
}

.animate-spell-flight-enhanced {
  animation: spell-flight-enhanced 1.2s ease-out forwards;
}

.animate-spell-trail {
  animation: spell-trail 0.8s ease-out forwards;
}

.animate-spell-particles {
  animation: spell-particles 1s ease-out forwards;
}

.animate-typing-dot {
  animation: typing-dot 1.4s ease-in-out infinite;
}
`;

// Adiciona os estilos ao documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);