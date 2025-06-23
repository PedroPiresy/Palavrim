import { useState, useEffect, useCallback } from 'react';
import { LetterState, KeyboardKey } from '../types/game';
import { api } from '../utils/api';

export interface TetraState {
  words: [string, string, string, string];
  guesses: string[];
  currentGuess: string;
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
    currentGuess: '',
    status: ['playing', 'playing', 'playing', 'playing'],
    maxAttempts: 9,
    loading: true,
  });

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
        currentGuess: '',
        status: ['playing', 'playing', 'playing', 'playing'],
        maxAttempts: 9,
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao inicializar Tetra:', error);
      notify('Erro ao carregar modo Abracatetra.');
      setTetraState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    initializeTetra();
  }, []);

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
    if (tetraState.currentGuess.length >= 5) return;
    
    setTetraState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess + letter.toUpperCase()
    }));
  };

  const removeLetter = () => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    
    setTetraState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1)
    }));
  };

  const submitGuess = async () => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    if (tetraState.currentGuess.length !== 5) return;

    if (tetraState.guesses.includes(tetraState.currentGuess)) {
      notify('Você já tentou esta palavra!');
      return;
    }

    try {
      const resultado = await api.verificarPalavra(tetraState.currentGuess);
      if (!resultado.existe) {
        notify('Palavra não encontrada!');
        return;
      }

      const newGuesses = [...tetraState.guesses, tetraState.currentGuess];
      const isGameOver = newGuesses.length >= tetraState.maxAttempts;
      
      const newStatus = tetraState.words.map((word, i) => {
        if (tetraState.status[i] !== 'playing') return tetraState.status[i];
        if (tetraState.currentGuess === word) return 'won';
        if (isGameOver) return 'lost';
        return 'playing';
      }) as TetraState['status'];

      const correctWords = newStatus.filter(s => s === 'won').length;
      const previousCorrect = tetraState.status.filter(s => s === 'won').length;
      const newCorrectWords = correctWords - previousCorrect;

      setTetraState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: '',
        status: newStatus,
      }));

      // Notificações baseadas no resultado
      if (newCorrectWords > 0) {
        if (newCorrectWords === 1) {
          notify(`🎉 Palavra ${correctWords} correta!`);
        } else {
          notify(`🎉 ${newCorrectWords} palavras corretas de uma vez!`);
        }
      } else if (isGameOver) {
        notify(`😔 Fim de jogo! Palavras: ${tetraState.words.join(', ')}`);
      }

      onGameEvent?.('guessSubmitted', { correctWords: newCorrectWords, isGameOver });
    } catch (error) {
      console.error('Erro ao submeter palpite:', error);
      notify('Erro ao verificar palavra.');
    }
  };

  const restartTetra = () => {
    initializeTetra();
  };

  return {
    tetraState,
    getLetterStates,
    getKeyboardStates,
    addLetter,
    removeLetter,
    submitGuess,
    restartTetra,
  };
};