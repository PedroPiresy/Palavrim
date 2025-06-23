import { useState, useEffect, useCallback } from 'react';
import { LetterState, KeyboardKey } from '../types/game';
import { api } from '../utils/api';

export interface TetraState {
  words: [string, string, string, string];
  guesses: string[];
  currentGuess: string[];
  selectedIndex: number;
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
    selectedIndex: 0,
    status: ['playing', 'playing', 'playing', 'playing'],
    maxAttempts: 9,
    loading: false,
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
        currentGuess: Array(5).fill(''),
        selectedIndex: 0,
        status: ['playing', 'playing', 'playing', 'playing'],
        maxAttempts: 9,
        loading: false,
      });

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

  const selectIndex = (index: number) => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    setTetraState(prev => ({ ...prev, selectedIndex: index }));
  };

  const addLetter = (letter: string) => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    let guessArr = [...tetraState.currentGuess];
    guessArr[tetraState.selectedIndex] = letter.toUpperCase();
    setTetraState(prev => ({
      ...prev,
      currentGuess: guessArr,
      selectedIndex: Math.min(prev.selectedIndex + 1, 4)
    }));
  };

  const removeLetter = () => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    let guessArr = [...tetraState.currentGuess];
    guessArr[tetraState.selectedIndex] = '';
    setTetraState(prev => ({
      ...prev,
      currentGuess: guessArr,
      selectedIndex: Math.max(prev.selectedIndex - 1, 0)
    }));
  };

  const submitGuess = async () => {
    if (tetraState.status.every(s => s !== 'playing')) return;
    const guessString = tetraState.currentGuess.join('');
    if (guessString.length !== 5 || tetraState.currentGuess.includes('')) return;
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
        selectedIndex: 0,
        status: newStatus,
      }));

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

      // Notificações baseadas no resultado
      const gameIsWon = correctWords === 4;

      if (gameIsWon) {
        notify('🎉 Incrível! Você acertou todas as quatro palavras!');
        onGameEvent?.('gameWon');
      } else if (newCorrectWords > 0) {
        if (newCorrectWords === 1) {
          notify(`🎉 ${correctWords}ª palavra correta!`);
        } else {
          notify(`🎉 ${newCorrectWords} palavras corretas de uma vez!`);
        }
        onGameEvent?.('partialWin');
      } else if (isGameOver) {
        notify(`😔 Fim de jogo! Palavras: ${tetraState.words.join(', ')}`);
        onGameEvent?.('gameLost');
      } else {
        // Progresso geral
        onGameEvent?.('progress');
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
    setTetraState,
    getLetterStates,
    getKeyboardStates,
    addLetter,
    removeLetter,
    submitGuess,
    selectIndex,
    restartTetra,
  };
};