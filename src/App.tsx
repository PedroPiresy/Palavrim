import React, { useState, useEffect } from 'react';
import { GameHeader } from './components/GameHeader';
import { GameGrid } from './components/GameGrid';
import { Keyboard } from './components/Keyboard';
import { HelpModal } from './components/HelpModal';
import { Notification } from './components/Notification';
import { useGame } from './hooks/useGame';
import { Loader2 } from 'lucide-react';
import { api } from './utils/api';
import PalavrimLayout from './components/PalavrimLayout';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NotFound from './NotFound';

function App() {
  const [notification, setNotification] = useState<string>('');
  const [notificationKey, setNotificationKey] = useState(0);
  const showNotification = (message: string) => {
    setNotification(message);
    setNotificationKey(prev => prev + 1);
    setTimeout(() => setNotification(''), 1600);
  };

  const {
    gameState,
    wordLength,
    loading,
    palavraCorreta,
    getLetterStates,
    getKeyboardStates,
    addLetter,
    removeLetter,
    submitGuess,
    restartGame,
    selectedIndex,
    selectIndex
  } = useGame(showNotification);

  const [showHelp, setShowHelp] = useState(true);
  const [modo, setModo] = useState<'normal' | 'dueto' | 'abracatetra'>('normal');

  // Estado para Dueto
  const [dueto, setDueto] = useState({
    word1: '',
    word2: '',
    guesses: [] as string[],
    currentGuess: '',
    status1: 'playing' as 'playing' | 'won' | 'lost',
    status2: 'playing' as 'playing' | 'won' | 'lost',
    maxAttempts: 7,
    loading: false,
  });

  // Estado para Abracatetra
  const [tetra, setTetra] = useState({
    words: [ '', '', '', '' ],
    guesses: [] as string[],
    currentGuess: '',
    status: [ 'playing', 'playing', 'playing', 'playing' ] as ('playing' | 'won' | 'lost')[],
    maxAttempts: 9,
    loading: false,
  });

  // Estado do modo comando Vim
  const [modoComando, setModoComando] = useState(false);
  const [comando, setComando] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Adicionar estado para grid ativo no modo dueto
  const [duetoAtivo, setDuetoAtivo] = useState<1 | 2>(1);

  const navigate = useNavigate();

  // Redireciona para 404 se for mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      navigate('/notfound');
    }
  }, [navigate]);

  // Iniciar modo Dueto
  const iniciarDueto = async () => {
    navigate('/notfound');
  };

  // Iniciar modo Abracatetra
  const iniciarTetra = async () => {
    navigate('/notfound');
  };

  // Modificar funções de digitação do dueto para só permitir digitação no grid ativo
  const addLetterDueto = (letter: string) => {
    if (modoComando) return;
    if ((duetoAtivo === 1 && dueto.status1 !== 'playing') ||
        (duetoAtivo === 2 && dueto.status2 !== 'playing')) return;
    if (dueto.status1 !== 'playing' && dueto.status2 !== 'playing') return;
    if (dueto.currentGuess.length >= 5) return;
    setDueto(prev => ({ ...prev, currentGuess: prev.currentGuess + letter.toUpperCase() }));
  };
  const removeLetterDueto = () => {
    if (modoComando) return;
    if (dueto.status1 !== 'playing' && dueto.status2 !== 'playing') return;
    setDueto(prev => ({ ...prev, currentGuess: prev.currentGuess.slice(0, -1) }));
  };
  const submitGuessDueto = async () => {
    if (dueto.status1 !== 'playing' && dueto.status2 !== 'playing') return;
    if (dueto.currentGuess.length !== 5) return;
    // Verifica palavra para ambos os grids
    const [res1, res2] = await Promise.all([
      api.verificarPalavra(dueto.currentGuess),
      api.verificarPalavra(dueto.currentGuess)
    ]);
    if (!res1.existe && !res2.existe) {
      showNotification('Palavra não encontrada!');
      return;
    }
    const newGuesses = [...dueto.guesses, dueto.currentGuess];
    const isCorrect1 = dueto.currentGuess === dueto.word1;
    const isCorrect2 = dueto.currentGuess === dueto.word2;
    const isGameOver = newGuesses.length >= dueto.maxAttempts;
    const newStatus1 = isCorrect1 ? 'won' : (isGameOver ? 'lost' : dueto.status1);
    const newStatus2 = isCorrect2 ? 'won' : (isGameOver ? 'lost' : dueto.status2);
    
    // Adiciona delay se acertou alguma palavra
    if (isCorrect1 || isCorrect2) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setDueto(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      status1: newStatus1,
      status2: newStatus2,
    }));
  };
  const restartDueto = () => iniciarDueto();

  // Lógica de adicionar/remover letra e submit para Abracatetra
  const addLetterTetra = (letter: string) => {
    if (modoComando) return;
    if (tetra.status.every(s => s !== 'playing')) return;
    if (tetra.currentGuess.length >= 5) return;
    setTetra(prev => ({ ...prev, currentGuess: prev.currentGuess + letter.toUpperCase() }));
  };
  const removeLetterTetra = () => {
    if (modoComando) return;
    if (tetra.status.every(s => s !== 'playing')) return;
    setTetra(prev => ({ ...prev, currentGuess: prev.currentGuess.slice(0, -1) }));
  };
  const submitGuessTetra = async () => {
    if (tetra.status.every(s => s !== 'playing')) return;
    if (tetra.currentGuess.length !== 5) return;
    // Verifica palavra para todos os grids
    const results = await Promise.all(
      tetra.words.map(word => api.verificarPalavra(tetra.currentGuess))
    );
    if (results.every(r => !r.existe)) {
      showNotification('Palavra não encontrada!');
      return;
    }
    const newGuesses = [...tetra.guesses, tetra.currentGuess];
    const newStatus = tetra.words.map((word, i) => {
      if (tetra.status[i] !== 'playing') return tetra.status[i];
      if (tetra.currentGuess === word) return 'won';
      if (newGuesses.length >= tetra.maxAttempts) return 'lost';
      return 'playing';
    });
    
    // Adiciona delay se acertou alguma palavra
    if (newStatus.some(status => status === 'won')) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setTetra(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      status: newStatus,
    }));
  };
  const restartTetra = () => iniciarTetra();

  // Funções para estados das letras e teclado no Dueto
  const getLetterStatesDueto = (guess: string, word: string) => {
    const result: any[] = [];
    const wordArray = word.split('');
    const guessArray = guess.split('');
    const wordLetterCount: { [key: string]: number } = {};
    wordArray.forEach(letter => {
      wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
    });
    guessArray.forEach((letter, index) => {
      if (letter === wordArray[index]) {
        result[index] = { letter, status: 'correct' };
        wordLetterCount[letter]--;
      } else {
        result[index] = { letter, status: 'absent' };
      }
    });
    guessArray.forEach((letter, index) => {
      if (result[index].status === 'absent' && wordLetterCount[letter] > 0) {
        result[index] = { letter, status: 'present' };
        wordLetterCount[letter]--;
      }
    });
    return result;
  };
  const getKeyboardStatesDueto = () => {
    const keyStates: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' } = {};
    dueto.guesses.forEach(guess => {
      [dueto.word1, dueto.word2].forEach(word => {
        const letterStates = getLetterStatesDueto(guess, word);
        letterStates.forEach(({ letter, status }) => {
          if (status === 'correct') {
            keyStates[letter] = 'correct';
          } else if (status === 'present' && keyStates[letter] !== 'correct') {
            keyStates[letter] = 'present';
          } else if (status === 'absent' && !keyStates[letter]) {
            keyStates[letter] = 'absent';
          }
        });
      });
    });
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map(letter => ({
      key: letter,
      status: keyStates[letter] || 'unused'
    }));
  };

  // Funções para estados das letras e teclado no Abracatetra
  const getLetterStatesTetra = (guess: string, word: string) => {
    const result: any[] = [];
    const wordArray = word.split('');
    const guessArray = guess.split('');
    const wordLetterCount: { [key: string]: number } = {};
    wordArray.forEach(letter => {
      wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
    });
    guessArray.forEach((letter, index) => {
      if (letter === wordArray[index]) {
        result[index] = { letter, status: 'correct' };
        wordLetterCount[letter]--;
      } else {
        result[index] = { letter, status: 'absent' };
      }
    });
    guessArray.forEach((letter, index) => {
      if (result[index].status === 'absent' && wordLetterCount[letter] > 0) {
        result[index] = { letter, status: 'present' };
        wordLetterCount[letter]--;
      }
    });
    return result;
  };
  const getKeyboardStatesTetra = () => {
    const keyStates: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' } = {};
    tetra.guesses.forEach(guess => {
      tetra.words.forEach(word => {
        const letterStates = getLetterStatesTetra(guess, word);
        letterStates.forEach(({ letter, status }) => {
          if (status === 'correct') {
            keyStates[letter] = 'correct';
          } else if (status === 'present' && keyStates[letter] !== 'correct') {
            keyStates[letter] = 'present';
          } else if (status === 'absent' && !keyStates[letter]) {
            keyStates[letter] = 'absent';
          }
        });
      });
    });
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map(letter => ({
      key: letter,
      status: keyStates[letter] || 'unused'
    }));
  };

  // Handler para voltar ao modo normal
  const voltarParaNormal = () => {
    setModo('normal');
    restartGame();
  };

  // Handler para ativar modo comando ao clicar no botão restart
  const ativarModoComando = () => {
    setModoComando(true);
    setComando('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handler para sair do modo comando
  const sairModoComando = () => {
    setModoComando(false);
    setComando('');
  };

  // Handler para processar comando
  const processarComando = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (comando.trim() === 'q!') {
        sairModoComando();
        if (modo === 'dueto') restartDueto();
        else if (modo === 'abracatetra') restartTetra();
        else restartGame();
      } else if (comando.trim() === 'admin') {
        sairModoComando();
        if (modo === 'dueto') {
          showNotification(`Respostas: ${dueto.word1}, ${dueto.word2}`);
        } else if (modo === 'abracatetra') {
          showNotification(`Respostas: ${tetra.words.join(', ')}`);
        } else {
          showNotification(`Resposta: ${palavraCorreta}`);
        }
      }
    } else if (e.key === 'Escape') {
      sairModoComando();
    }
  };

  // Listener global para Shift+; (:) abrir o prompt
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
      const isVimCommand = (e.shiftKey && e.key === ';') || e.key === ':';
      if (!modoComando && isVimCommand && !isInput) {
        setModoComando(true);
        setComando('');
        setTimeout(() => inputRef.current?.focus(), 100);
        e.preventDefault();
      } else if (modoComando && isVimCommand) {
        inputRef.current?.focus();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modoComando]);

  // Para o modo normal, sobrescrever addLetter/removeLetter para checar modoComando
  const addLetterNormal = (letter: string) => {
    if (modoComando) return;
    addLetter(letter);
  };
  const removeLetterNormal = () => {
    if (modoComando) return;
    removeLetter();
  };

  const [showMeaning, setShowMeaning] = useState(false);

  const fetchMeaning = async (word: string) => {
    setShowMeaning(true);
  };

  if (loading || dueto.loading || tetra.loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <img src="/assets/images/Palavrim.png" alt="Palavrim" className="w-16 h-16 animate-pulse" />
          </div>
          <p className="text-[#d0d0d0] text-lg font-mono">Carregando Palavrim...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/*" element={
        <PalavrimLayout>
          <div className="w-full max-w-full m-0 p-0">
            <GameHeader
              onShowHelp={() => setShowHelp(true)}
              onRestart={ativarModoComando}
              onDueto={iniciarDueto}
              onQuarteto={iniciarTetra}
              onHome={voltarParaNormal}
              onTrainingMode={() => {}}
            />
          </div>
          <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full py-4">
            {notification && (
              <div className="w-full flex justify-center mb-4">
                <Notification
                  key={notificationKey}
                  message={notification}
                  type={
                    notification.includes('Erro') || notification.includes('pena') || notification.includes('😔') ? 'error' :
                    (notification.includes('Parabéns') || notification.includes('🎉') ? 'success' : 'info')
                  }
                />
              </div>
            )}
            <div className="w-full flex flex-col md:flex-row md:gap-8 items-center justify-center space-y-6 md:space-y-0">
              {modo === 'dueto' ? (
                <>
                  <GameGrid
                    guesses={dueto.guesses}
                    currentGuess={dueto.currentGuess.split('')}
                    wordLength={5}
                    maxAttempts={7}
                    getLetterStates={g => getLetterStatesDueto(g, dueto.word1)}
                    isCompleted={dueto.status1 !== 'playing'}
                    selectedIndex={0}
                    selectIndex={() => {}}
                  />
                  <GameGrid
                    guesses={dueto.guesses}
                    currentGuess={dueto.currentGuess.split('')}
                    wordLength={5}
                    maxAttempts={7}
                    getLetterStates={g => getLetterStatesDueto(g, dueto.word2)}
                    isCompleted={dueto.status2 !== 'playing'}
                    selectedIndex={0}
                    selectIndex={() => {}}
                  />
                </>
              ) : modo === 'abracatetra' ? (
                <>
                  {tetra.words.map((word, idx) => (
                    <GameGrid
                      key={idx}
                      guesses={tetra.guesses}
                      currentGuess={tetra.currentGuess.split('')}
                      wordLength={5}
                      maxAttempts={9}
                      getLetterStates={g => getLetterStatesTetra(g, word)}
                      isCompleted={false}
                      selectedIndex={0}
                      selectIndex={() => {}}
                    />
                  ))}
                </>
              ) : (
              <GameGrid
                guesses={gameState.guesses}
                currentGuess={gameState.currentGuess}
                wordLength={wordLength}
                maxAttempts={gameState.maxAttempts}
                getLetterStates={getLetterStates}
                isCompleted={false}
                selectedIndex={selectedIndex}
                selectIndex={selectIndex}
              />
              )}
            </div>
            <Keyboard
              keyboardStates={modo === 'dueto' ? getKeyboardStatesDueto() : modo === 'abracatetra' ? getKeyboardStatesTetra() : getKeyboardStates()}
              onKeyPress={modo === 'dueto' ? addLetterDueto : modo === 'abracatetra' ? addLetterTetra : addLetterNormal}
              onDelete={modo === 'dueto' ? removeLetterDueto : modo === 'abracatetra' ? removeLetterTetra : removeLetterNormal}
              onEnter={modo === 'dueto' ? submitGuessDueto : modo === 'abracatetra' ? submitGuessTetra : submitGuess}
              disabled={modo === 'dueto'
                ? dueto.status1 !== 'playing' && dueto.status2 !== 'playing'
                : modo === 'abracatetra'
                  ? tetra.status.every(s => s !== 'playing')
                  : gameState.gameStatus !== 'playing'}
            />
            {modo === 'dueto' && (dueto.status1 !== 'playing' && dueto.status2 !== 'playing') && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="p-6 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] shadow-xl min-w-[320px] max-w-full flex flex-col items-center">
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-bold text-[#8b5cf6] font-mono flex items-center justify-center gap-2">
                      {dueto.guesses.length === dueto.maxAttempts ? (
                        <span className="text-3xl">Ufa!</span>
                      ) : (
                        <>Abracadupla finalizado!</>
                      )}
                    </h3>
                    <p className="text-[#d0d0d0] font-mono">
                      Palavra 1: <span className="font-bold text-[#4ade80]">{dueto.word1}</span> - {dueto.status1 === 'won' ? 'Acertou!' : 'Errou!'}<br />
                      Palavra 2: <span className="font-bold text-[#4ade80]">{dueto.word2}</span> - {dueto.status2 === 'won' ? 'Acertou!' : 'Errou!'}
                      </p>
                    </div>
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={restartDueto}
                      className="px-6 py-3 bg-[#8b5cf6] text-white font-mono rounded-lg hover:bg-[#6d28d9] transition-all duration-200"
                    >
                      Jogar Novamente
                    </button>
                  </div>
                </div>
              </div>
            )}
            {modo === 'abracatetra' && tetra.status.every(s => s !== 'playing') && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="p-6 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] shadow-xl min-w-[320px] max-w-full flex flex-col items-center">
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-bold text-[#8b5cf6] font-mono flex items-center justify-center gap-2">
                      {tetra.guesses.length === tetra.maxAttempts ? (
                        <span className="text-3xl">Ufa!</span>
                      ) : (
                        <>Abracatetra finalizado!</>
                      )}
                    </h3>
                    {tetra.words.map((word, idx) => (
                      <p key={idx} className="text-[#d0d0d0] font-mono">
                        Palavra {idx + 1}: <span className="font-bold text-[#4ade80]">{word}</span> - {tetra.status[idx] === 'won' ? 'Acertou!' : 'Errou!'}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={restartTetra}
                    className="mt-4 px-6 py-3 bg-[#8b5cf6] text-white font-mono rounded-lg hover:bg-[#6d28d9] transition-all duration-200"
                  >
                    Jogar Novamente
                  </button>
                </div>
              </div>
            )}
            {modo === 'normal' && gameState.gameStatus !== 'playing' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="p-6 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] shadow-xl min-w-[320px] max-w-full flex flex-col items-center">
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-bold text-[#8b5cf6] font-mono flex items-center justify-center gap-2">
                      {gameState.gameStatus === 'won' ? (
                        <>
                          {gameState.guesses.length === 1 ? (
                            <>🎉 Parabéns! <span className="ml-2 text-3xl">THE GOAT 🐐</span></>
                          ) : gameState.guesses.length === gameState.maxAttempts ? (
                            <span className="text-3xl">Ufa!</span>
                          ) : (
                            <>🎉 Parabéns!</>
                          )}
                        </>
                      ) : (
                        <>😔 Que pena!</>
                      )}
                    </h3>
                    <p className="text-[#d0d0d0] font-mono">
                      {gameState.gameStatus === 'won' ? (
                        <>Você descobriu a palavra em {gameState.guesses.length} tentativa{gameState.guesses.length !== 1 ? 's' : ''}!<br />
                        Palavra: <span className="font-bold text-[#4ade80]">{palavraCorreta}</span></>
                      ) : (
                        <>A palavra era: <span className="font-bold text-[#4ade80]">{palavraCorreta}</span></>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={restartGame}
                      className="px-6 py-3 bg-[#8b5cf6] text-white font-mono rounded-lg hover:bg-[#6d28d9] transition-all duration-200"
                    >
                      Jogar Novamente
                    </button>
                    <button
                      onClick={() => fetchMeaning(palavraCorreta)}
                      className="px-6 py-3 bg-[#4ade80] text-[#1a1a1a] font-mono rounded-lg hover:bg-[#22c55e] transition-all duration-200"
                    >
                      Ver significado no Wiktionary
                    </button>
                  </div>
                </div>
              </div>
            )}
            {modoComando && (
              <>
                {/* Overlay para capturar foco e impedir interação */}
                <div
                  tabIndex={0}
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={e => { e.preventDefault(); inputRef.current?.focus(); }}
                  onFocus={() => inputRef.current?.focus()}
                />
                {/* Linha de comando estilo Vim no footer */}
                <div className="fixed left-0 right-0 bottom-0 z-50 w-full bg-black border-t border-[#8b5cf6] flex items-center px-4 py-2" style={{minHeight: '48px'}}>
                  <span className="text-[#8b5cf6] font-mono text-xl mr-2">:</span>
                  <input
                    ref={inputRef}
                    className="bg-transparent border-none outline-none text-[#d0d0d0] font-mono text-xl w-32"
                    value={comando}
                    onChange={e => setComando(e.target.value)}
                    onKeyDown={processarComando}
                    autoFocus
                    spellCheck={false}
                    placeholder="q!"
                  />
                  <span className="ml-4 text-[#8b5cf6] font-mono text-xs">Digite <b>q!</b> e Enter para reiniciar, <b>Esc</b> para cancelar.</span>
                </div>
              </>
            )}
            {/* Modal de significado */}
            {showMeaning && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-[#1a1a1a] border border-[#8b5cf6] rounded-lg p-6 max-w-4xl w-full h-[80vh] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#8b5cf6] font-mono">Significado de "{palavraCorreta}"</h2>
                    <button
                      onClick={() => setShowMeaning(false)}
                      className="p-2 rounded bg-[#2d2d2d] text-[#d0d0d0] hover:bg-[#3d3d3d] border border-[#3d3d3d] hover:border-[#8b5cf6] transition-colors font-mono"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <iframe
                      src={`https://pt.wiktionary.org/wiki/${palavraCorreta.toLowerCase()}`}
                      className="w-full h-full border border-[#3d3d3d] rounded"
                      title={`Significado de ${palavraCorreta}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
          <HelpModal
            isOpen={showHelp}
            onClose={() => setShowHelp(false)}
          />
        </PalavrimLayout>
      } />
    </Routes>
  );
}

export default App;