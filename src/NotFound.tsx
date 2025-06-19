import { useState, useEffect } from 'react';
import { Terminal, Code, ArrowLeft, Zap, Circle } from 'lucide-react';

function App() {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  
  const lines = [
    'E404: File not found',
    'Press ENTER or type command to continue'
  ];

  useEffect(() => {
    const text = '404';
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setCurrentLine(1), 500);
      }
    }, 300);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono overflow-hidden relative">
      {/* Palavrim-style background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-1 h-full">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="bg-purple-500 h-full opacity-20"></div>
          ))}
        </div>
      </div>

      {/* Terminal scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-purple-900/5 to-transparent animate-pulse"></div>
      </div>

      {/* Floating code particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-purple-400 opacity-30 animate-float text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            {['palavrim', 'nvim', ':q', ':w', 'esc', 'hjkl', '/', '?', 'dd', 'yy'][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Palavrim status bar */}
        <div className="bg-purple-800 text-white px-4 py-1 text-sm border-b border-purple-600">
          <div className="flex justify-between items-center">
            <span className="flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>404.palavrim [RO]</span>
            </span>
            <span className="text-purple-200">-- NORMAL --</span>
          </div>
        </div>

        {/* Line numbers sidebar */}
        <div className="flex flex-1">
          <div className="bg-gray-800 text-gray-500 px-3 py-4 text-sm border-r border-gray-700 min-h-full">
            <div className="space-y-1">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="text-right w-8">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-8 relative">
            {/* Palavrim command area */}
            <div className="absolute top-4 left-12 text-purple-300 text-sm">
              <span className="opacity-60">~</span>
            </div>

            <div className="flex flex-col items-center justify-center min-h-full space-y-8">
              {/* ASCII Art Terminal */}
              <div className="relative">
                <div className="bg-black border-2 border-purple-600 rounded-lg p-6 shadow-2xl shadow-purple-900/50">
                  <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-700">
                    <div className="flex space-x-1">
                      <Circle className="w-3 h-3 text-red-500 fill-current" />
                      <Circle className="w-3 h-3 text-yellow-500 fill-current" />
                      <Circle className="w-3 h-3 text-green-500 fill-current" />
                    </div>
                    <span className="text-gray-400 text-sm ml-4">palavrim: error.log</span>
                  </div>
                  
                  {/* Typing effect for 404 */}
                  <div className="text-center space-y-4">
                    <div className="text-6xl md:text-8xl font-bold text-purple-400 tracking-wider">
                      {typedText}
                      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                        █
                      </span>
                    </div>
                    
                    {/* Palavrim error messages */}
                    <div className="space-y-2 text-left max-w-md">
                      {currentLine >= 1 && (
                        <div className="text-red-400 animate-fade-in">
                          <span className="text-purple-300">E404:</span> File not found
                        </div>
                      )}
                      {currentLine >= 1 && (
                        <div className="text-yellow-400 animate-fade-in animation-delay-500">
                          Press ENTER or type command to continue
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Glitch effects around terminal */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 opacity-60 animate-ping"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-cyan-400 opacity-40 animate-pulse"></div>
                <div className="absolute top-1/2 -right-4 w-2 h-8 bg-purple-400 opacity-30 animate-bounce"></div>
              </div>

              {/* Palavrim-style error message */}
              <div className="bg-gray-800 border border-purple-600 rounded p-4 max-w-2xl">
                <div className="flex items-start space-x-3">
                  <Code className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    <h2 className="text-purple-300 font-semibold">
                      :help! Page not found
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Modo ainda em desenvolvimento.
                      <br />
                    </p>
                  </div>
                </div>
              </div>

            

              {/* Return button styled as palavrim command */}
              <button 
                onClick={handleReturnHome}
                className="group relative bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded border border-purple-500 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 font-mono"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-purple-200">:</span>
                  <ArrowLeft className="w-4 h-4" />
                  <span>home</span>
                  <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-4 h-4" />
                  </span>
                </div>
              </button>

              {/* Palavrim mode indicator */}
              <div className="text-center text-xs text-gray-500 space-y-1">
                <div>-- INSERT --</div>
                <div className="flex items-center justify-center space-x-4">
                  <span>1,1</span>
                  <span>All</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="bg-purple-800 text-purple-100 px-4 py-1 text-xs border-t border-purple-600">
          <div className="flex justify-between">
            <span>404.palavrim [readonly] 1L, 3C</span>
            <span>utf-8[unix]</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.6; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        /* Custom scrollbar for palavrim feel */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #7c3aed;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>
    </div>
  );
}

export default App;