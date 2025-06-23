import { useState, useEffect, useCallback } from 'react';
import { LetterState, KeyboardKey } from '../types/game';
import { api } from '../utils/api';

export interface TetraState {
  words: [string, string, string, string];
  guesses: string[];
  currentGuess: string[];
  status: ['playing' | 'won' | 'lost', 'playing' | 'won' | 'lost', 'playing' | 'won' | 'lost', 'playing' | 'won' | 'lost'];
  maxAttempts: number;
  loading: boolean;
}

export const useTetra = (
  showNotification?: (msg: string) => void,
  onGameEvent?: (event: string, ...args: any[]) => void
) => {
  const [tetraState, setTetraState] = useState<TetraState>({
    words: ['', '', '', ''],
    guesses: [],
    currentGuess: Array(5).fill(''),
    status: ['playing', 'playing', 'playing', 'playing'],
    maxAttempts: 9,
    loading: false,
  });

  // Estado para controlar a posição selecionada no grid
  const [selectedIndex, setSelectedIndex] = useState(0);

  const notify = (msg: string) => {
    if (showNotification) showNotification(msg);
  };

  const initializeTetra = async () => {
    setTetraState(prev => ({ ...prev, loading: true }));
    try {
      const palavras = await Promise.all([
        api.getPalavraAleatoria(),
        api.getPalavraAleatoria(),
        api.getPalavraAleatoria(),
        api.getPalavraAleatoria()
      ]);

      // Garante que todas as palavras são diferentes
      const uniqueWords = new Set(palavras);
      while (uniqueWords.size < 4) {
        const novaPalavra = await api.getPalavraAleatoria();
        uniqueWords.add(novaPalavra);
      }

      const finalWords = Array.from(uniqueWords).slice(0, 4) as [string, string, string, string];

      setTetraState({
        words: finalWords,
        guesses: [],
        currentGuess: Array(5).fill(''),
        status: ['playing', 'playing', 'playing', 'playing'],
        maxAttempts: 9,
        loading: false,
      });

      // Reset da posição selecionada
      setSelectedIndex(0);

      // Dispara evento de início do jogo
      onGameEvent?.('gameStarted');
    } catch (error) {
      console.error('Erro ao inicializar Tetra:', error);
      notify('Erro ao carregar modo Abracatetra.');
      setTetraState(prev => ({ ...prev, loading: false }));
    }
  };

  const getLetterStates = useCallback((guess: string, word: string): LetterState[] => {
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
  }, []);

  const getKeyboardStates = useCallback((): KeyboardKey[] => {
    const keyStates: { [key: string]: 'correct' | 'present' | 'absent' | 'unused' } = {};
    
    tetraState.guesses.forEach(guess => {
      tetraState.words.forEach(word => {
        const letterStates = getLetterStates(guess, word);
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
  }, [tetraState.guesses, tetraState.words, getLetterStates]);

  const addLetter = (letter: string) => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    if (tetraState.currentGuess[selectedIndex] !== '') return; // Não sobrescreve se já tem letra
    
    let guessArr = [...tetraState.currentGuess];
    guessArr[selectedIndex] = letter.toUpperCase();
    
    setTetraState(prev => ({
      ...prev,
      currentGuess: guessArr
    }));
    
    // Move para a próxima posição
    setSelectedIndex(idx => Math.min(idx + 1, 4));
  };

  const removeLetter = () => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    
    let guessArr = [...tetraState.currentGuess];
    guessArr[selectedIndex] = '';
    
    setTetraState(prev => ({
      ...prev,
      currentGuess: guessArr
    }));
    
    // Move para a posição anterior
    setSelectedIndex(idx => Math.max(idx - 1, 0));
  };

  const selectIndex = (index: number) => {
    setSelectedIndex(Math.max(0, Math.min(index, 4)));
  };

  const submitGuess = async () => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    const guessString = tetraState.currentGuess.join('');
    
    if (guessString.length !== 5 || tetraState.currentGuess.includes('')) {
      notify('Palavra deve ter 5 letras!');
      return;
    }

    if (tetraState.guesses.includes(guessString)) {
      notify('Você já tentou esta palavra!');
      onGameEvent?.('duplicateGuess');
      return;
    }

    try {
      const resultado = await api.verificarPalavra(guessString);
      if (!resultado.existe) {
        notify('Palavra não encontrada!');
        onGameEvent?.('invalidWord');
        return;
      }

      const newGuesses = [...tetraState.guesses, guessString];
      const isGameOver = newGuesses.length >= tetraState.maxAttempts;
      
      // Verifica se o palpite não acertou nenhuma letra em nenhuma das palavras
      const isAllGray = tetraState.words.every(word => {
        const letterStates = getLetterStates(guessString, word);
        return letterStates.every(state => state.status === 'absent');
      });
      
      const newStatus = tetraState.words.map((word, i) => {
        if (tetraState.status[i] !== 'playing') return tetraState.status[i];
        if (guessString === word) return 'won';
        if (isGameOver) return 'lost';
        return 'playing';
      }) as TetraState['status'];

      const correctWords = newStatus.filter(s => s === 'won').length;
      const previousCorrect = tetraState.status.filter(s => s === 'won').length;
      const newCorrectWords = correctWords - previousCorrect;

      setTetraState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: Array(5).fill(''),
        status: newStatus,
      }));

      // Reset da posição selecionada
      setSelectedIndex(0);

      // Eventos para palpites ruins
      if (isAllGray) {
        if (newGuesses.length === 1) {
          onGameEvent?.('firstGuessFlop');
        } else {
          onGameEvent?.('anotherBadGuess');
        }
      }

      // Última tentativa
      if (newGuesses.length === tetraState.maxAttempts - 1) {
        onGameEvent?.('lastAttempt');
      }

      // Eventos de progresso
      if (correctWords === 4) {
        onGameEvent?.('gameWon');
      } else if (newCorrectWords > 0) {
        onGameEvent?.('partialWin');
      } else if (isGameOver) {
        onGameEvent?.('gameLost');
      } else {
        onGameEvent?.('progress');
      }

    } catch (error) {
      console.error('Erro ao verificar palavra:', error);
      notify('Erro ao verificar palavra.');
    }
  };

  const restartTetra = () => {
    setTetraState(prev => ({
      ...prev,
      guesses: [],
      currentGuess: Array(5).fill(''),
      status: ['playing', 'playing', 'playing', 'playing'],
    }));
    setSelectedIndex(0);
  };

  return {
    tetraState,
    initializeTetra,
    getLetterStates,
    getKeyboardStates,
    addLetter,
    removeLetter,
    submitGuess,
    restartTetra,
    selectedIndex,
    selectIndex,
  };
};