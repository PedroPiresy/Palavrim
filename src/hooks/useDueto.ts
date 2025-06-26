import { useState, useEffect, useCallback } from 'react';
import { LetterState, KeyboardKey } from '../types/game';
import { api, removerAcentos } from '../utils/api';
import { buscarPalavraAcentuada } from '../utils/accentCorrection';

export interface DuetoState {
  word1: string;
  word2: string;
  guesses: string[];
  currentGuess: string[];
  selectedIndex: number;
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
    currentGuess: Array(5).fill(''),
    selectedIndex: 0,
    status1: 'playing',
    status2: 'playing',
    maxAttempts: 7,
    loading: false,
  });

  // Novo estado para armazenar as versões acentuadas dos palpites
  const [guessesAcentuadas, setGuessesAcentuadas] = useState<string[]>([]);

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
        currentGuess: Array(5).fill(''),
        selectedIndex: 0,
        status1: 'playing',
        status2: 'playing',
        maxAttempts: 7,
        loading: false,
      });

      setGuessesAcentuadas([]); // Limpa as versões acentuadas

      // Dispara evento de início do jogo
      onGameEvent?.('gameStarted');
    } catch (error) {
      console.error('Erro ao inicializar Dueto:', error);
      notify('Erro ao carregar modo Abracadupla.');
      setDuetoState(prev => ({ ...prev, loading: false }));
    }
  };

  // Função para obter a versão acentuada de um palpite
  const getGuessAcentuada = useCallback((index: number): string => {
    if (index < guessesAcentuadas.length) {
      return guessesAcentuadas[index];
    }
    // Fallback para a versão original se não tiver a acentuada
    return duetoState.guesses[index] || '';
  }, [guessesAcentuadas, duetoState.guesses]);

  const getLetterStates = useCallback((guess: string, word: string): LetterState[] => {
    if (!word) return [];
    
    // Encontra o índice deste palpite
    const guessIndex = duetoState.guesses.indexOf(guess);
    
    // Se encontrou o índice, usa a versão acentuada para exibição
    const displayGuess = guessIndex >= 0 ? getGuessAcentuada(guessIndex) : guess;
    
    const result: LetterState[] = [];
    const wordArray = word.split('');
    const guessArray = guess.split(''); // Usa a versão original para lógica
    const displayArray = displayGuess.split(''); // Usa a versão acentuada para exibição
    
    const wordArraySemAcento = wordArray.map(removerAcentos);
    const guessArraySemAcento = guessArray.map(removerAcentos);
    const wordLetterCount: { [key: string]: number } = {};
    
    wordArraySemAcento.forEach(letra => {
      wordLetterCount[letra] = (wordLetterCount[letra] || 0) + 1;
    });
    
    // Primeiro: marca as letras corretas
    guessArraySemAcento.forEach((letra, index) => {
      if (letra === wordArraySemAcento[index]) {
        result[index] = { 
          letter: displayArray[index] || guessArray[index], // Usa versão acentuada se disponível
          status: 'correct' 
        };
        wordLetterCount[letra]--;
      } else {
        result[index] = { 
          letter: displayArray[index] || guessArray[index], // Usa versão acentuada se disponível
          status: 'absent' 
        };
      }
    });
    
    // Segundo: marca as presentes na posição errada
    guessArraySemAcento.forEach((letra, index) => {
      if (result[index].status === 'absent' && wordLetterCount[letra] > 0) {
        result[index] = { 
          letter: displayArray[index] || guessArray[index], // Usa versão acentuada se disponível
          status: 'present' 
        };
        wordLetterCount[letra]--;
      }
    });
    
    return result;
  }, [duetoState.guesses, getGuessAcentuada]);

  const getKeyboardStates = useCallback((): KeyboardKey[] => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map(letter => {
      // Para cada palavra, calcula o status da letra
      const status1 = duetoState.guesses.some(guess => getLetterStates(guess, duetoState.word1).some(ls => removerAcentos(ls.letter) === letter && ls.status === 'correct'))
        ? 'correct'
        : duetoState.guesses.some(guess => getLetterStates(guess, duetoState.word1).some(ls => removerAcentos(ls.letter) === letter && ls.status === 'present'))
        ? 'present'
        : duetoState.guesses.some(guess => getLetterStates(guess, duetoState.word1).some(ls => removerAcentos(ls.letter) === letter && ls.status === 'absent'))
        ? 'absent'
        : 'unused';
      const status2 = duetoState.guesses.some(guess => getLetterStates(guess, duetoState.word2).some(ls => removerAcentos(ls.letter) === letter && ls.status === 'correct'))
        ? 'correct'
        : duetoState.guesses.some(guess => getLetterStates(guess, duetoState.word2).some(ls => removerAcentos(ls.letter) === letter && ls.status === 'present'))
        ? 'present'
        : duetoState.guesses.some(guess => getLetterStates(guess, duetoState.word2).some(ls => removerAcentos(ls.letter) === letter && ls.status === 'absent'))
        ? 'absent'
        : 'unused';
      return {
        key: letter,
        status: [status1, status2]
      };
    });
  }, [duetoState.guesses, duetoState.word1, duetoState.word2, getLetterStates]);

  const selectIndex = (index: number) => {
    if (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') return;
    setDuetoState(prev => ({ ...prev, selectedIndex: index }));
  };

  const addLetter = (letter: string) => {
    if (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') return;
    let guessArr = [...duetoState.currentGuess];
    guessArr[duetoState.selectedIndex] = letter.toUpperCase();
    setDuetoState(prev => ({
      ...prev,
      currentGuess: guessArr,
      selectedIndex: Math.min(prev.selectedIndex + 1, 4)
    }));
  };

  const removeLetter = () => {
    if (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') return;
    let guessArr = [...duetoState.currentGuess];
    guessArr[duetoState.selectedIndex] = '';
    setDuetoState(prev => ({
      ...prev,
      currentGuess: guessArr,
      selectedIndex: Math.max(prev.selectedIndex - 1, 0)
    }));
  };

  const submitGuess = async () => {
    if (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') return;
    const guessString = duetoState.currentGuess.join('');
    if (guessString.length !== 5 || duetoState.currentGuess.includes('')) return;
    if (duetoState.guesses.includes(guessString)) {
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

      // Busca a versão acentuada da palavra antes de adicionar aos palpites
      const palavraAcentuada = await buscarPalavraAcentuada(guessString);
      
      const newGuesses = [...duetoState.guesses, guessString];
      const newGuessesAcentuadas = [...guessesAcentuadas, palavraAcentuada];
      
      const isCorrect1 = guessString === duetoState.word1;
      const isCorrect2 = guessString === duetoState.word2;
      const isGameOver = newGuesses.length >= duetoState.maxAttempts;

      // Verifica se o palpite não acertou nenhuma letra em nenhuma das palavras
      const letterStates1 = getLetterStates(guessString, duetoState.word1);
      const letterStates2 = getLetterStates(guessString, duetoState.word2);
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
        currentGuess: Array(5).fill(''),
        selectedIndex: 0,
        status1: newStatus1,
        status2: newStatus2,
      }));

      setGuessesAcentuadas(newGuessesAcentuadas);

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
    setDuetoState,
    getLetterStates,
    getKeyboardStates,
    addLetter,
    removeLetter,
    submitGuess,
    selectIndex,
    restartDueto,
    getGuessAcentuada, // Nova função exportada
  };
};