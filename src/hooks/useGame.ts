import { useState, useEffect, useCallback } from 'react';
import { GameState, LetterState, KeyboardKey, SpeedRunStats } from '../types/game';
import { api } from '../utils/api';

export type GameEvent = 'invalidWord' | 'duplicateGuess';

export const useGame = (
  showNotification?: (msg: string) => void,
  onGameEvent?: (event: GameEvent, ...args: any[]) => void
) => {
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    guesses: [],
    currentGuess: Array(5).fill(''),
    gameStatus: 'playing',
    maxAttempts: 6,
    isSpeedRun: false,
  });

  const [wordLength, setWordLength] = useState(5);
  const [loading, setLoading] = useState(true);
  const [palavraCorreta, setPalavraCorreta] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [speedRunTime, setSpeedRunTime] = useState(0);
  const [isSpeedRunActive, setIsSpeedRunActive] = useState(false);

  // Inicializar jogo
  useEffect(() => {
    initializeGame();
  }, []);

  const notify = (msg: string) => {
    if (showNotification) showNotification(msg);
  };

  const initializeGame = async () => {
    setLoading(true);
    try {
      const tamanho = await api.getTamanho();
      const palavra = await api.getPalavraAleatoria();
      setWordLength(tamanho);
      setPalavraCorreta(palavra);
      setGameState(prev => ({
        ...prev,
        word: palavra,
        guesses: [],
        currentGuess: Array(tamanho).fill(''),
        gameStatus: 'playing',
        isSpeedRun: false,
        speedRunTime: undefined,
      }));
      setSelectedIndex(0);
      setSpeedRunTime(0);
      setIsSpeedRunActive(false);
    } catch (error) {
      console.error('Erro ao inicializar jogo:', error);
      notify('Erro ao carregar jogo. Usando modo offline.');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar modo speed run
  const startSpeedRun = async () => {
    setLoading(true);
    try {
      const tamanho = await api.getTamanho();
      const palavra = await api.getPalavraAleatoria();
      setWordLength(tamanho);
      setPalavraCorreta(palavra);
      setGameState(prev => ({
        ...prev,
        word: palavra,
        guesses: [],
        currentGuess: Array(tamanho).fill(''),
        gameStatus: 'playing',
        isSpeedRun: true,
        speedRunTime: undefined,
      }));
      setSelectedIndex(0);
      setSpeedRunTime(0);
      setIsSpeedRunActive(true);
    } catch (error) {
      console.error('Erro ao iniciar speed run:', error);
      notify('Erro ao iniciar speed run. Usando modo offline.');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar tempo do speed run
  const updateSpeedRunTime = (time: number) => {
    setSpeedRunTime(time);
  };

  // Obter estado das letras para um palpite
  const getLetterStates = useCallback((guess: string): LetterState[] => {
    const { word } = gameState;
    if (!word) return [];
    const result: LetterState[] = [];
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
  }, [gameState.word]);

  const checkGuessIsAllGray = useCallback((guess: string): boolean => {
    const states = getLetterStates(guess);
    return states.length > 0 && states.every(s => s.status === 'absent');
  }, [getLetterStates]);

  const checkGuessHasPresentWithoutCorrect = useCallback((guess: string): boolean => {
    const states = getLetterStates(guess);
    if (states.length === 0) return false;

    const hasPresent = states.some(s => s.status === 'present');
    const hasCorrect = states.some(s => s.status === 'correct');
    
    return hasPresent && !hasCorrect;
  }, [getLetterStates]);

  const checkGuessHasPresentAndCorrect = useCallback((guess: string): boolean => {
    const states = getLetterStates(guess);
    if (states.length === 0) return false;

    const hasPresent = states.some(s => s.status === 'present');
    const hasCorrect = states.some(s => s.status === 'correct');
    
    return hasPresent && hasCorrect;
  }, [getLetterStates]);

  // Obter estado do teclado
  const getKeyboardStates = useCallback((): KeyboardKey[] => {
    const keyStates: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' } = {};
    gameState.guesses.forEach(guess => {
      const letterStates = getLetterStates(guess);
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
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map(letter => ({
      key: letter,
      status: keyStates[letter] || 'unused'
    }));
  }, [gameState.guesses, getLetterStates]);

  const getReveleableLetters = useCallback((): string[] => {
    const keyStates: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' } = {};
    gameState.guesses.forEach(guess => {
      const letterStates = getLetterStates(guess);
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

    const uniqueCorrectLetters = new Set(palavraCorreta.split('').filter(letter => keyStates[letter] === 'correct'));
    const allUniqueLetters = new Set(palavraCorreta.split(''));
    
    const reveleable = [...allUniqueLetters].filter(letter => !uniqueCorrectLetters.has(letter));
    return reveleable;
  }, [gameState.guesses, getLetterStates, palavraCorreta]);

  const getRevealablePosition = useCallback((): number | null => {
    const correctlyGuessedIndices = new Set<number>();
    gameState.guesses.forEach(guess => {
      guess.split('').forEach((letter, index) => {
        if (letter === palavraCorreta[index]) {
          correctlyGuessedIndices.add(index);
        }
      });
    });

    const availableIndices = [];
    for (let i = 0; i < wordLength; i++) {
      if (!correctlyGuessedIndices.has(i)) {
        availableIndices.push(i);
      }
    }

    if (availableIndices.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    return availableIndices[randomIndex];
  }, [gameState.guesses, palavraCorreta, wordLength]);

  const revealLetterInGrid = (letter: string, index: number) => {
    if (gameState.gameStatus !== 'playing') return;
    const newGuess = Array(wordLength).fill('');
    newGuess[index] = letter.toUpperCase();
    setGameState(prev => ({
      ...prev,
      currentGuess: newGuess,
    }));
    setSelectedIndex(Math.min(index + 1, wordLength - 1));
  };

  // Adicionar letra na posição selecionada
  const addLetter = (letter: string) => {
    if (gameState.gameStatus !== 'playing') return;
    let guessArr = [...gameState.currentGuess];
    guessArr[selectedIndex] = letter.toUpperCase();
    setGameState(prev => ({
      ...prev,
      currentGuess: guessArr
    }));
    setSelectedIndex(idx => Math.min(idx + 1, wordLength - 1));
  };

  // Remover letra da posição selecionada
  const removeLetter = () => {
    if (gameState.gameStatus !== 'playing') return;
    let guessArr = [...gameState.currentGuess];
    guessArr[selectedIndex] = '';
    setGameState(prev => ({
      ...prev,
      currentGuess: guessArr
    }));
    setSelectedIndex(idx => Math.max(idx - 1, 0));
  };

  // Selecionar célula
  const selectIndex = (index: number) => {
    if (gameState.gameStatus !== 'playing') return;
    setSelectedIndex(index);
  };

  // Submeter palpite
  const submitGuess = async () => {
    if (gameState.gameStatus !== 'playing') return;
    const guessString = gameState.currentGuess.join('');

    if (gameState.guesses.includes(guessString)) {
      notify('Você já tentou esta palavra!');
      onGameEvent?.('duplicateGuess');
      return;
    }

    if (guessString.length !== wordLength || gameState.currentGuess.includes('')) {
      notify(`Palavra deve ter ${wordLength} letras!`);
      return;
    }
    const resultado = await api.verificarPalavra(guessString);
    if (!resultado.existe) {
      notify('Palavra não encontrada!');
      onGameEvent?.('invalidWord');
      return;
    }
    const newGuesses = [...gameState.guesses, guessString];
    const isCorrect = resultado.estados.every(estado => estado === 'correct');
    const isGameOver = newGuesses.length >= gameState.maxAttempts;
    let newStatus: 'playing' | 'won' | 'lost' = 'playing';
    
    if (isCorrect) {
      newStatus = 'won';
      if (gameState.isSpeedRun) {
        setIsSpeedRunActive(false);
        const finalTime = speedRunTime;
        setGameState(prev => ({ ...prev, speedRunTime: finalTime }));
        notify(`🎉 Parabéns! Você completou em ${formatTime(finalTime)}!`);
      } else {
        notify('🎉 Parabéns! Você acertou!');
      }
    } else if (isGameOver) {
      newStatus = 'lost';
      if (gameState.isSpeedRun) {
        setIsSpeedRunActive(false);
      } else {
        notify(`😔 A palavra era: ${palavraCorreta}`);
      }
    }

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: Array(wordLength).fill(''),
      gameStatus: newStatus
    }));

    setSelectedIndex(0);
  };

  // Formatar tempo para exibição
  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Reiniciar jogo
  const restartGame = () => {
    if (gameState.isSpeedRun) {
      startSpeedRun();
    } else {
      initializeGame();
    }
  };

  return {
    gameState,
    wordLength,
    loading,
    palavraCorreta,
    getLetterStates,
    getKeyboardStates,
    getReveleableLetters,
    getRevealablePosition,
    revealLetterInGrid,
    checkGuessIsAllGray,
    checkGuessHasPresentWithoutCorrect,
    checkGuessHasPresentAndCorrect,
    addLetter,
    removeLetter,
    submitGuess,
    restartGame,
    selectedIndex,
    selectIndex,
    startSpeedRun,
    updateSpeedRunTime,
    isSpeedRunActive,
    speedRunTime,
    formatTime
  };
};