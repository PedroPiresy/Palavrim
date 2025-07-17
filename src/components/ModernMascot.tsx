import React, { useState, useEffect } from 'react';

interface ModernMascotProps {
  message: string;
  isCastingSpell?: boolean;
}

export const ModernMascot: React.FC<ModernMascotProps> = ({ message, isCastingSpell = false }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        delay: Math.random() * 2000,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const sparkleInterval = setInterval(generateSparkles, 4000);

    return () => clearInterval(sparkleInterval);
  }, []);

  return (
    <div className="hidden lg:flex fixed bottom-20 right-8 flex-col items-center gap-3 z-20">
      <div className="card-elevated p-4 rounded-xl max-w-xs animate-slide-in-up">
        <div className="relative">
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {message}
          </p>
          
          {!message && (
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)]/20 to-[var(--accent-blue-hover)]/20 rounded-full blur-lg animate-pulse"></div>
        
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-hover)] p-2 relative z-10">
          <img 
            src="/assets/images/Palavrim.png" 
            alt="Mascote Mago"
            className={`w-full h-full transition-all duration-300 ${
              isCastingSpell ? 'animate-bounce-custom' : 'hover:scale-105'
            } ${
              isBlinking ? 'brightness-75' : ''
            }`}
          />
        </div>

        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-blue-hover)] rounded-full animate-pulse pointer-events-none"
            style={{
              left: `50%`,
              top: `50%`,
              transform: `translate(${sparkle.x}px, ${sparkle.y}px)`,
              animationDelay: `${sparkle.delay}ms`,
            }}
          />
        ))}

        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[var(--accent-blue)]/50 to-transparent rounded-full animate-pulse"></div>
      </div>
      
      {isCastingSpell && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div className="absolute bottom-20 right-8 w-6 h-6 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-blue-hover)] rounded-full animate-bounce shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-blue-hover)] rounded-full animate-pulse"></div>
          </div>
          
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-20 right-8 w-1 h-1 bg-[var(--accent-blue)] rounded-full animate-bounce"
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