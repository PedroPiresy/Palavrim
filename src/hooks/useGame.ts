import { useState, useEffect, useCallback } from 'react';
import { GameState, LetterState, KeyboardKey } from '../types/game';
import { api } from '../utils/api';

export const useGame = (showNotification?: (msg: string) => void) => {
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    guesses: [],
    currentGuess: Array(5).fill(''),
    gameStatus: 'playing',
    maxAttempts: 6,
  });

  const [wordLength, setWordLength] = useState(5);
  const [loading, setLoading] = useState(true);
  const [palavraCorreta, setPalavraCorreta] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      }));
      setSelectedIndex(0);
    } catch (error) {
      console.error('Erro ao inicializar jogo:', error);
      notify('Erro ao carregar jogo. Usando modo offline.');
    } finally {
      setLoading(false);
    }
  };

  // Obter estado das letras para um palpite
  const getLetterStates = useCallback((guess: string): LetterState[] => {
    const { word } = gameState;
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
    if (guessString.length !== wordLength || gameState.currentGuess.includes('')) {
      notify(`Palavra deve ter ${wordLength} letras!`);
      return;
    }
    const resultado = await api.verificarPalavra(guessString);
    if (!resultado.existe) {
      notify('Palavra não encontrada!');
      return;
    }
    const newGuesses = [...gameState.guesses, guessString];
    const isCorrect = resultado.estados.every(estado => estado === 'correct');
    const isGameOver = newGuesses.length >= gameState.maxAttempts;
    let newStatus: 'playing' | 'won' | 'lost' = 'playing';
    if (isCorrect) {
      newStatus = 'won';
      notify('🎉 Parabéns! Você acertou!');
    } else if (isGameOver) {
      newStatus = 'lost';
      notify(`😔 A palavra era: ${palavraCorreta}`);
    }
    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: Array(wordLength).fill(''),
      gameStatus: newStatus
    }));
    setSelectedIndex(0);
  };

  // Reiniciar jogo
  const restartGame = () => {
    initializeGame();
  };

  return {
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
  };
};