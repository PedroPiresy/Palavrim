import { useState, useEffect, useCallback } from 'react';
import { LetterState, KeyboardKey } from '../types/game';
import { api } from '../utils/api';

export interface DuetoState {
  word1: string;
  word2: string;
  guesses: string[];
  currentGuess: string;
  status1: 'playing' | 'won' | 'lost';
  status2: 'playing' | 'won' | 'lost';
  maxAttempts: number;
  loading: boolean;
}

export const useDueto = (
  showNotification?: (msg: string) => void,
  onGameEvent?: (event: string, ...args: any[]) => void
) => {
  const [duetoState, setDuetoState] = useState<DuetoState>({
    word1: '',
    word2: '',
    guesses: [],
    currentGuess: '',
    status1: 'playing',
    status2: 'playing',
    maxAttempts: 7,
    loading: false,
  });

  const notify = (msg: string) => {
    if (showNotification) showNotification(msg);
  };

  const initializeDueto = async () => {
    setDuetoState(prev => ({ ...prev, loading: true }));
    try {
      const [palavra1, palavra2] = await Promise.all([
        api.getPalavraAleatoria(),
        api.getPalavraAleatoria()
      ]);
      
      // Garante que as palavras são diferentes
      let finalWord2 = palavra2;
      if (palavra1 === palavra2) {
        finalWord2 = await api.getPalavraAleatoria();
      }

      setDuetoState({
        word1: palavra1,
        word2: finalWord2,
        guesses: [],
        currentGuess: '',
        status1: 'playing',
        status2: 'playing',
        maxAttempts: 7,
        loading: false,
      });

      // Dispara evento de início do jogo
      onGameEvent?.('gameStarted');
    } catch (error) {
      console.error('Erro ao inicializar Dueto:', error);
      notify('Erro ao carregar modo Abracadupla.');
      setDuetoState(prev => ({ ...prev, loading: false }));
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
    
    duetoState.guesses.forEach(guess => {
      const letterStates1 = getLetterStates(guess, duetoState.word1);
      const letterStates2 = getLetterStates(guess, duetoState.word2);
      
      [...letterStates1, ...letterStates2].forEach(({ letter, status }) => {
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
  }, [duetoState.guesses, duetoState.word1, duetoState.word2, getLetterStates]);

  const addLetter = (letter: string) => {
    if (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') return;
    if (duetoState.currentGuess.length >= 5) return;
    
    setDuetoState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess + letter.toUpperCase()
    }));
  };

  const removeLetter = () => {
    if (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') return;
    
    setDuetoState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1)
    }));
  };

  const submitGuess = async () => {
    if (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') return;
    if (duetoState.currentGuess.length !== 5) return;

    if (duetoState.guesses.includes(duetoState.currentGuess)) {
      notify('Você já tentou esta palavra!');
      onGameEvent?.('duplicateGuess');
      return;
    }

    try {
      const resultado = await api.verificarPalavra(duetoState.currentGuess);
      if (!resultado.existe) {
        notify('Palavra não encontrada!');
        onGameEvent?.('invalidWord');
        return;
      }

      const newGuesses = [...duetoState.guesses, duetoState.currentGuess];
      const isCorrect1 = duetoState.currentGuess === duetoState.word1;
      const isCorrect2 = duetoState.currentGuess === duetoState.word2;
      const isGameOver = newGuesses.length >= duetoState.maxAttempts;

      // Verifica se o palpite não acertou nenhuma letra em nenhuma das palavras
      const letterStates1 = getLetterStates(duetoState.currentGuess, duetoState.word1);
      const letterStates2 = getLetterStates(duetoState.currentGuess, duetoState.word2);
      const isAllGray = letterStates1.every(state => state.status === 'absent') && 
                       letterStates2.every(state => state.status === 'absent');

      let newStatus1 = duetoState.status1;
      let newStatus2 = duetoState.status2;

      if (isCorrect1 && duetoState.status1 === 'playing') {
        newStatus1 = 'won';
      } else if (isGameOver && duetoState.status1 === 'playing') {
        newStatus1 = 'lost';
      }

      if (isCorrect2 && duetoState.status2 === 'playing') {
        newStatus2 = 'won';
      } else if (isGameOver && duetoState.status2 === 'playing') {
        newStatus2 = 'lost';
      }

      setDuetoState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: '',
        status1: newStatus1,
        status2: newStatus2,
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
      if (newGuesses.length === duetoState.maxAttempts - 1) {
        onGameEvent?.('lastAttempt');
      }

      // Notificações baseadas no resultado
      const gameIsWon = newStatus1 === 'won' && newStatus2 === 'won';
      const justWonFirst = newStatus1 === 'won' && duetoState.status1 === 'playing';
      const justWonSecond = newStatus2 === 'won' && duetoState.status2 === 'playing';

      if (gameIsWon) {
        // This handles the case where the last guess solves the second word, or both at once.
        notify('🎉 Incrível! Você acertou ambas as palavras!');
        onGameEvent?.('gameWon');
      } else if (justWonFirst || justWonSecond) {
        // This is a true partial win. One word solved, the other still playing.
        notify(justWonFirst ? '🎉 Primeira palavra correta!' : '🎉 Segunda palavra correta!');
        onGameEvent?.('partialWin');
      } else if (isGameOver) {
        // isGameOver is true, but gameIsWon is false, so it's a loss
        notify(`😔 Fim de jogo! Palavras: ${duetoState.word1}, ${duetoState.word2}`);
        onGameEvent?.('gameLost');
      } else {
        // Not a win, not a loss, not game over. Just a guess.
        onGameEvent?.('progress');
      }

      onGameEvent?.('guessSubmitted', { isCorrect1, isCorrect2, isGameOver });
    } catch (error) {
      console.error('Erro ao submeter palpite:', error);
      notify('Erro ao verificar palavra.');
    }
  };

  const restartDueto = () => {
    initializeDueto();
  };

  return {
    duetoState,
    getLetterStates,
    getKeyboardStates,
    addLetter,
    removeLetter,
    submitGuess,
    restartDueto,
  };
};