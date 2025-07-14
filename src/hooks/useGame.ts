import { useState, useEffect, useCallback } from 'react';
import { GameState, LetterState, KeyboardKey, SpeedRunStats } from '../types/game';
import { api, removerAcentos } from '../utils/api';
import { buscarPalavraAcentuada } from '../utils/accentCorrection';

export type GameEvent = 'invalidWord' | 'duplicateGuess' | 'oneLetterAway';

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
  
  const [guessesAcentuadas, setGuessesAcentuadas] = useState<string[]>([]);

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
      setGuessesAcentuadas([]);
    } catch (error) {
      console.error('Erro ao inicializar jogo:', error);
      notify('Erro ao carregar jogo. Usando modo offline.');
    } finally {
      setLoading(false);
    }
  };

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
      setIsSpeedRunActive(false);
      setGuessesAcentuadas([]);
    } catch (error) {
      console.error('Erro ao iniciar speed run:', error);
      notify('Erro ao iniciar speed run. Usando modo offline.');
    } finally {
      setLoading(false);
    }
  };

  const activateSpeedRunTimer = useCallback(() => {
    setIsSpeedRunActive(true);
  }, []);

  const updateSpeedRunTime = (time: number) => {
    setSpeedRunTime(time);
  };

  const getGuessAcentuada = useCallback((index: number): string => {
    if (index < guessesAcentuadas.length) {
      return guessesAcentuadas[index];
    }
    return gameState.guesses[index] || '';
  }, [guessesAcentuadas, gameState.guesses]);

  const getLetterStates = useCallback((guess: string): LetterState[] => {
    const { word } = gameState;
    if (!word) return [];
    
    const guessIndex = gameState.guesses.indexOf(guess);
    
    const displayGuess = guessIndex >= 0 ? getGuessAcentuada(guessIndex) : guess;
    
    const result: LetterState[] = [];
    const wordArray = word.split('');
    const guessArray = guess.split('');
    const displayArray = displayGuess.split('');
    
    const wordArraySemAcento = wordArray.map(removerAcentos);
    const guessArraySemAcento = guessArray.map(removerAcentos);
    const wordLetterCount: { [key: string]: number } = {};
    
    wordArraySemAcento.forEach(letra => {
      wordLetterCount[letra] = (wordLetterCount[letra] || 0) + 1;
    });
    
    guessArraySemAcento.forEach((letra, index) => {
      if (letra === wordArraySemAcento[index]) {
        result[index] = { 
          letter: displayArray[index] || guessArray[index],
          status: 'correct' 
        };
        wordLetterCount[letra]--;
      } else {
        result[index] = { 
          letter: displayArray[index] || guessArray[index],
          status: 'absent' 
        };
      }
    });
    
    guessArraySemAcento.forEach((letra, index) => {
      if (result[index].status === 'absent' && wordLetterCount[letra] > 0) {
        result[index] = { 
          letter: displayArray[index] || guessArray[index],
          status: 'present' 
        };
        wordLetterCount[letra]--;
      }
    });
    
    return result;
  }, [gameState.word, gameState.guesses, getGuessAcentuada]);

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

  const getKeyboardStates = useCallback((): KeyboardKey[] => {
    const keyStates: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' } = {};
    gameState.guesses.forEach(guess => {
      const letterStates = getLetterStates(guess);
      letterStates.forEach(({ letter, status }) => {
        const letterSemAcento = removerAcentos(letter);
        if (status === 'correct') {
          keyStates[letterSemAcento] = 'correct';
        } else if (status === 'present' && keyStates[letterSemAcento] !== 'correct') {
          keyStates[letterSemAcento] = 'present';
        } else if (status === 'absent' && !keyStates[letterSemAcento]) {
          keyStates[letterSemAcento] = 'absent';
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

  const addLetter = (letter: string) => {
    if (gameState.gameStatus !== 'playing') return;
    let guessArr = [...gameState.currentGuess];
    guessArr[selectedIndex] = letter.toUpperCase();
    
    const newGuessString = guessArr.join('');
    if (
      newGuessString.length === wordLength &&
      !guessArr.includes('') &&
      newGuessString !== palavraCorreta
    ) {
      let diff = 0;
      for (let i = 0; i < wordLength; i++) {
        if (newGuessString[i] !== palavraCorreta[i]) {
          diff++;
        }
      }
      if (diff === 1) {
        onGameEvent?.('oneLetterAway');
      }
    }

    setGameState(prev => ({
      ...prev,
      currentGuess: guessArr
    }));
    setSelectedIndex(idx => Math.min(idx + 1, wordLength - 1));
  };

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

  const selectIndex = (index: number) => {
    if (gameState.gameStatus !== 'playing') return;
    setSelectedIndex(index);
  };

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

    const palavraAcentuada = await buscarPalavraAcentuada(guessString);
    
    const newGuesses = [...gameState.guesses, guessString];
    const newGuessesAcentuadas = [...guessesAcentuadas, palavraAcentuada];
    
    const isCorrect = removerAcentos(guessString) === removerAcentos(gameState.word);
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

    setGuessesAcentuadas(newGuessesAcentuadas);
    setSelectedIndex(0);
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

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
    activateSpeedRunTimer,
    updateSpeedRunTime,
    isSpeedRunActive,
    speedRunTime,
    formatTime,
    getGuessAcentuada,
  };
};