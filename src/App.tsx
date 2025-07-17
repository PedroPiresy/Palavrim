import React, { useState, useEffect } from 'react';
import { ModernHeader } from './components/ModernHeader';
import { ModernGameGrid } from './components/ModernGameGrid';
import { DuetoGrid } from './components/DuetoGrid';
import { TetraGrid } from './components/TetraGrid';
import { ModernKeyboard } from './components/ModernKeyboard';
import { ModernSpellbook } from './components/ModernSpellbook';
import { HelpModal } from './components/HelpModal';
import { SpeedRunHelpModal } from './components/SpeedRunHelpModal';
import { DuetoHelpModal } from './components/DuetoHelpModal';
import { TetraHelpModal } from './components/TetraHelpModal';
import { StatsModal } from './components/StatsModal';
import { ModernNotification } from './components/ModernNotification';
import { useGame, GameEvent } from './hooks/useGame';
import { useDueto } from './hooks/useDueto';
import { useTetra } from './hooks/useTetra';
import { Loader2, Home, Play, BookOpen, BarChartHorizontal } from 'lucide-react';
import { api } from './utils/api';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NotFound from './NotFound';
import {
  GameStats,
  loadStats,
  saveStats,
  getInitialStats,
  updateStatsOnWin,
  updateStatsOnLoss,
  updateLetterFrequency,
  updateWeeklyEvolution,
  updateStatsOnWordWin,
  applyXp,
  getRankForLevel,
} from './utils/stats';
import { getMascotMessage, MessageType } from './utils/mascotMessages';
import { ModernMascot } from './components/ModernMascot';
import { useTour } from '@reactour/tour';
import { AboutModal } from './components/AboutModal';
import { Countdown } from './components/Countdown';

function App() {
  const [notification, setNotification] = useState<string>('');
  const [notificationKey, setNotificationKey] = useState(0);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');
  
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification(message);
    setNotificationType(type);
    setNotificationKey(prev => prev + 1);
    setTimeout(() => setNotification(''), 2200);
  };

  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [mascotKey, setMascotKey] = useState(0);
  const [isCastingSpell, setIsCastingSpell] = useState(false);
  const [shouldExplode, setShouldExplode] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [wordToSearch, setWordToSearch] = useState('');

  const triggerMascotMessage = (type: MessageType, rank?: string) => {
    setTimeout(() => {
      setMascotMessage(getMascotMessage(type, rank));
      setMascotKey(prev => prev + 1);
    }, 500);
  };

  const {
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
    formatTime
  } = useGame(showNotification, (event) => {
    if (event === 'oneLetterAway') {
      const isLastGuess = gameState.guesses.length === gameState.maxAttempts - 1;
      if (!isLastGuess) {
        triggerMascotMessage(event as MessageType);
      }
    } else {
      triggerMascotMessage(event as MessageType);
    }
  });

  // Hooks para os novos modos
  const {
    duetoState,
    getLetterStates: getDuetoLetterStates,
    getKeyboardStates: getDuetoKeyboardStates,
    addLetter: addDuetoLetter,
    removeLetter: removeDuetoLetter,
    submitGuess: submitDuetoGuess,
    restartDueto,
    selectIndex: selectDuetoIndex,
  } = useDueto(showNotification, (event) => {
    if (event === 'gameStarted') {
      triggerMascotMessage('duetoWelcome');
    } else if (event === 'gameWon') {
      triggerMascotMessage('duetoWin');
    } else if (event === 'gameLost') {
      triggerMascotMessage('duetoLoss');
    } else if (event === 'partialWin') {
      triggerMascotMessage('duetoPartialWin');
    } else if (event === 'progress') {
      triggerMascotMessage('duetoProgress');
    } else if (event === 'invalidWord') {
      triggerMascotMessage('duetoInvalidWord');
    } else if (event === 'duplicateGuess') {
      triggerMascotMessage('duetoDuplicateGuess');
    } else if (event === 'firstGuessFlop') {
      triggerMascotMessage('duetoFirstGuessFlop');
    } else if (event === 'anotherBadGuess') {
      triggerMascotMessage('duetoAnotherBadGuess');
    } else if (event === 'lastAttempt') {
      triggerMascotMessage('duetoLastAttempt');
    }
  });

  const {
    tetraState,
    getLetterStates: getTetraLetterStates,
    getKeyboardStates: getTetraKeyboardStates,
    addLetter: addTetraLetter,
    removeLetter: removeTetraLetter,
    submitGuess: submitTetraGuess,
    restartTetra,
    selectIndex: tetraSelectIndex,
  } = useTetra(showNotification, (event) => {
    if (event === 'gameStarted') {
      triggerMascotMessage('tetraWelcome');
    } else if (event === 'gameWon') {
      triggerMascotMessage('tetraWin');
    } else if (event === 'gameLost') {
      triggerMascotMessage('tetraLoss');
    } else if (event === 'partialWin') {
      triggerMascotMessage('tetraPartialWin');
    } else if (event === 'progress') {
      triggerMascotMessage('tetraProgress');
    } else if (event === 'invalidWord') {
      triggerMascotMessage('tetraInvalidWord');
    } else if (event === 'duplicateGuess') {
      triggerMascotMessage('tetraDuplicateGuess');
    } else if (event === 'firstGuessFlop') {
      triggerMascotMessage('tetraFirstGuessFlop');
    } else if (event === 'anotherBadGuess') {
      triggerMascotMessage('tetraAnotherBadGuess');
    } else if (event === 'lastAttempt') {
      triggerMascotMessage('tetraLastAttempt');
    }
  });

  const [showHelp, setShowHelp] = useState(true);
  const [showSpeedRunHelp, setShowSpeedRunHelp] = useState(false);
  const [showDuetoHelp, setShowDuetoHelp] = useState(false);
  const [showTetraHelp, setShowTetraHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [stats, setStats] = useState<GameStats>(getInitialStats());
  const [modo, setModo] = useState<'normal' | 'abracadupla' | 'abracatetra' | 'speedrun'>('normal');
  const [revealSpellUses, setRevealSpellUses] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { setIsOpen: setTourOpen } = useTour();

  useEffect(() => {
    restartGame();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let stats = loadStats();

    // Garante que a semana atual existe no histórico
    stats = updateWeeklyEvolution(stats);

    if (stats.lastDailyBonus !== today) {
      const manaToAdd = 15;
      const newMana = Math.min(stats.mana + manaToAdd, 100);
      const updatedStats = {
        ...stats,
        mana: newMana,
        lastDailyBonus: today,
      };
      setStats(updatedStats);
      saveStats(updatedStats);
      showNotification(`✨ +${manaToAdd} de Mana por seu retorno!`, 'success');
    } else {
      setStats(stats);
      saveStats(stats);
    }

    triggerMascotMessage('welcome');
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(c => (c ? c - 1 : null));
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (countdown === 0) {
      activateSpeedRunTimer();
      setCountdown(null);
    }
  }, [countdown, activateSpeedRunTimer]);

  // Reset logic for new games - reseta estados quando um novo jogo começa
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.guesses.length === 0 && modo === 'normal') {
      setRevealSpellUses(0);        // Reseta contador de feitiços usados
      setIsCastingSpell(false);     // Para animações de feitiço
      setShouldExplode(false);      // Para animações de explosão
      setShowVictoryModal(false);   // Fecha o modal de vitória/derrota
      triggerMascotMessage('welcome'); // Mensagem de boas-vindas
    }
  }, [gameState.gameStatus, gameState.guesses.length, modo]);

  // Efeito para detectar mudanças de modo e disparar mensagens específicas
  useEffect(() => {
    if (modo === 'abracadupla' && duetoState.guesses.length === 0 && !duetoState.loading) {
      triggerMascotMessage('duetoWelcome');
    } else if (modo === 'abracatetra' && tetraState.guesses.length === 0 && !tetraState.loading) {
      triggerMascotMessage('tetraWelcome');
    }
  }, [modo, duetoState.guesses.length, duetoState.loading, tetraState.guesses.length, tetraState.loading]);

  // Estado do modo comando Vim
  const [modoComando, setModoComando] = useState(false);
  const [comando, setComando] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // Iniciar modo Speed Run
  const iniciarSpeedRun = () => {
    setShowSpeedRunHelp(true);
  };

  // Começar Speed Run
  const comecarSpeedRun = async () => {
    setShowSpeedRunHelp(false);
    setModo('speedrun');
    await startSpeedRun();
    setCountdown(3);
  };

  // Iniciar modo Dueto
  const iniciarDueto = async () => {
    setShowDuetoHelp(true);
  };

  // Começar Dueto
  const comecarDueto = async () => {
    setShowDuetoHelp(false);
    setModo('abracadupla');
    await restartDueto();
  };

  // Iniciar modo Abracatetra
  const iniciarTetra = async () => {
    setShowTetraHelp(true);
  };

  // Começar Tetra
  const comecarTetra = async () => {
    setShowTetraHelp(false);
    setModo('abracatetra');
    await restartTetra();
  };

  const voltarParaNormal = () => {
    setModo('normal');
    restartGame();
  };

  const ativarModoComando = () => {
    setModoComando(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const sairModoComando = () => {
    setModoComando(false);
    setComando('');
  };

  const processarComando = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const command = comando.trim();

      if (command === 'q!') {
        sairModoComando();
        if (modo === 'abracadupla') restartDueto();
        else if (modo === 'abracatetra') restartTetra();
        else restartGame();
      } else if (command === 'admin') {
        sairModoComando();
        if (modo === 'abracadupla') {
          showNotification(`Respostas: ${duetoState.word1}, ${duetoState.word2}`, 'info');
        } else if (modo === 'abracatetra') {
          showNotification(`Respostas: ${tetraState.words.join(', ')}`, 'info');
        } else {
          showNotification(`Resposta: ${palavraCorreta}`, 'info');
        }
      } else if (command === 'magiaadmin') {
        sairModoComando();
        setStats(prevStats => {
            const newStats = { ...prevStats, mana: 100 };
            saveStats(newStats);
            return newStats;
        });
        showNotification('🔮 Mana restaurada para o máximo!', 'success');
      } else if (command.startsWith('xpadmin')) {
        sairModoComando();
        const parts = command.split(' ');
        const xpAmount = parts.length > 1 && !isNaN(parseInt(parts[1])) ? parseInt(parts[1]) : 50;

        setStats(prevStats => {
            const { newStats, leveledUp } = applyXp(prevStats, xpAmount);
            if (leveledUp) {
              setTimeout(() => {
                  showNotification(`🎉 Nível ${newStats.level}! ${newStats.rank}! +50 de Mana!`, 'success');
                  triggerMascotMessage('levelUp', newStats.rank);
              }, 500);
            }
            saveStats(newStats);
            return newStats;
        });
        showNotification(`⭐ +${xpAmount} de XP adicionados!`, 'success');
      } else if (command === 'resetxp') {
        sairModoComando();
        setStats(prevStats => {
          const newStats = { 
            ...prevStats, 
            xp: 0, 
            level: 1, 
            rank: getRankForLevel(1) 
          };
          saveStats(newStats);
          return newStats;
        });
        showNotification('🔄 XP e Nível foram resetados!', 'info');
      }
    } else if (e.key === 'Escape') {
      sairModoComando();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
      const isVimCommand = (e.shiftKey && e.key === ';') || e.key === ':';
      
      if (!modoComando && isVimCommand && !isInput) {
        setModoComando(true);
        setComando('');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
        e.preventDefault();
      } else if (modoComando && isVimCommand) {
        inputRef.current?.focus();
        e.preventDefault();
      } else if (modoComando && e.key === 'Escape') {
        sairModoComando();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modoComando]);

  const [showMeaning, setShowMeaning] = useState(false);

  const fetchMeaning = async (word: string) => {
    setWordToSearch(word);
    setShowMeaning(true);
  };

  // Efeito que controla quando mostrar o modal de vitória/derrota
  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      const guessCount = gameState.guesses.length;
      
      // Verifica se foi na última tentativa (vitória no limite)
      const wasLastAttempt = guessCount === gameState.maxAttempts;
      
      if (wasLastAttempt) {
        // Para vitórias no limite, ativa sequência de animações épicas antes do modal
        setIsCastingSpell(true);
        setTimeout(() => {
          setShouldExplode(true);
          setIsCastingSpell(false);
          // Mostra o modal após a animação terminar
          setTimeout(() => {
            setShowVictoryModal(true);
          }, 800); // Tempo para a explosão terminar
        }, 1000); // Tempo para o feitiço voar
      } else {
        // Para vitórias normais, mostra o modal imediatamente
        setShowVictoryModal(true);
      }
      
      // Mensagens do mascote baseadas no desempenho
      if (guessCount <= 2) {
        triggerMascotMessage('flawlessWin');
      } else if (guessCount === gameState.maxAttempts) {
        triggerMascotMessage('clutchWin');
      } else {
        triggerMascotMessage('win');
      }

      // Atualiza estatísticas do jogador
      setStats(prevStats => {
        const { newStats, leveledUp, xpGained } = updateStatsOnWin(prevStats, guessCount);
        showNotification(`+${xpGained} XP!`, 'success');
        if (leveledUp) {
            setTimeout(() => {
                showNotification(`🎉 Nível ${newStats.level}! ${newStats.rank}! +50 de Mana!`, 'success');
                triggerMascotMessage('levelUp', newStats.rank);
            }, 1800);
        }
        saveStats(newStats);
        return newStats;
      });
    } else if (gameState.gameStatus === 'lost') {
      // Para derrotas, mostra mensagem do mascote e atualiza estatísticas
      triggerMascotMessage('loss');
      setStats(prevStats => {
        const newStats = updateStatsOnLoss(prevStats);
        saveStats(newStats);
        return newStats;
      });
      
      // Para derrotas, também mostra o modal imediatamente
      setShowVictoryModal(true);
    }
    
    // Atualiza a chave do mascote quando o jogo termina
    if (gameState.gameStatus !== 'playing') {
      setMascotKey(prev => prev + 1);
    }
  }, [gameState.gameStatus]);

  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || gameState.guesses.length === 0) return;

    const lastGuess = gameState.guesses[gameState.guesses.length - 1];
    const isAllGray = checkGuessIsAllGray(lastGuess);

    if (isAllGray) {
      if (gameState.guesses.length === 1) {
        triggerMascotMessage('firstGuessFlop');
      } else {
        triggerMascotMessage('anotherBadGuess');
      }
    } else if (checkGuessHasPresentAndCorrect(lastGuess)) {
      triggerMascotMessage('makingProgress');
    } else if (checkGuessHasPresentWithoutCorrect(lastGuess)) {
      triggerMascotMessage('foundPresent');
    }

    // Last attempt warning
    if (gameState.guesses.length === gameState.maxAttempts - 1) {
      triggerMascotMessage('lastAttempt');
    }
  }, [gameState.guesses]);

  const handleWordWin = (guessCount: number) => {
    setStats(prevStats => {
      const { newStats, leveledUp, xpGained } = updateStatsOnWordWin(prevStats, guessCount);
      showNotification(`+${xpGained} XP!`, 'success');
      if (leveledUp) {
        setTimeout(() => {
          showNotification(`🎉 Nível ${newStats.level}! ${newStats.rank}! +50 de Mana!`, 'success');
          triggerMascotMessage('levelUp', newStats.rank);
        }, 1000);
      }
      saveStats(newStats);
      return newStats;
    });
  };

  const prevDuetoStatus1 = React.useRef(duetoState.status1);
  const prevDuetoStatus2 = React.useRef(duetoState.status2);
  useEffect(() => {
    if (modo !== 'abracadupla') return;
    const guessCount = duetoState.guesses.length;
    if (prevDuetoStatus1.current === 'playing' && duetoState.status1 === 'won') {
      handleWordWin(guessCount);
    }
    if (prevDuetoStatus2.current === 'playing' && duetoState.status2 === 'won') {
      handleWordWin(guessCount);
    }
    prevDuetoStatus1.current = duetoState.status1;
    prevDuetoStatus2.current = duetoState.status2;
  }, [duetoState.status1, duetoState.status2, modo, duetoState.guesses.length]);

  const prevTetraStatuses = React.useRef(tetraState.status);
  useEffect(() => {
    if (modo !== 'abracatetra') return;
    const guessCount = tetraState.guesses.length;
    tetraState.status.forEach((currentStatus, index) => {
      if(prevTetraStatuses.current[index] === 'playing' && currentStatus === 'won') {
        handleWordWin(guessCount);
      }
    });
    prevTetraStatuses.current = tetraState.status;
  }, [tetraState.status, modo, tetraState.guesses.length]);

  const castRevealLetterSpell = () => {
    const cost = 25;
    if (stats.mana < cost || revealSpellUses >= 2 || gameState.gameStatus !== 'playing') {
      showNotification('Não é possível lançar o feitiço agora.', 'error');
      return;
    }

    const position = getRevealablePosition();
    if (position === null) {
      showNotification('Todas as letras possíveis já foram reveladas ou adivinhadas!', 'info');
      return;
    }

    triggerMascotMessage('usedSpell');
    setRevealSpellUses(prev => prev + 1);
    const newStats = { ...stats, mana: stats.mana - cost };
    saveStats(newStats);
    setStats(newStats);

    const letterToReveal = palavraCorreta[position];
    revealLetterInGrid(letterToReveal, position);
    showNotification(`🔮 Feitiço lançado! Uma letra foi revelada no grid.`, 'success');
  };

  // Efeito para registrar a frequência de letras após cada palpite
  useEffect(() => {
    if (gameState.guesses.length > 0) {
      const lastGuess = gameState.guesses[gameState.guesses.length - 1];
      setStats(prevStats => {
        const newStats = updateLetterFrequency(prevStats, lastGuess);
        saveStats(newStats);
        return newStats;
      });
    }
  }, [gameState.guesses]);

  // Determina qual loading mostrar
  const isLoading = loading || duetoState.loading || tetraState.loading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-hover)] flex items-center justify-center animate-pulse">
              <img src="/assets/images/Palavrim.png" alt="Palavrim" className="w-10 h-10" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gradient">Palavrim</h2>
            <p className="text-[var(--text-secondary)]">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Função para determinar qual função usar baseada no modo
  const getCurrentAddLetter = () => {
    switch (modo) {
      case 'abracadupla': return addDuetoLetter;
      case 'abracatetra': return addTetraLetter;
      default: return addLetter;
    }
  };

  const getCurrentRemoveLetter = () => {
    switch (modo) {
      case 'abracadupla': return removeDuetoLetter;
      case 'abracatetra': return removeTetraLetter;
      default: return removeLetter;
    }
  };

  const getCurrentSubmitGuess = () => {
    switch (modo) {
      case 'abracadupla': return submitDuetoGuess;
      case 'abracatetra': return submitTetraGuess;
      default: return submitGuess;
    }
  };

  const getCurrentKeyboardStates = () => {
    switch (modo) {
      case 'abracadupla': return getDuetoKeyboardStates();
      case 'abracatetra': return getTetraKeyboardStates();
      default: return getKeyboardStates();
    }
  };

  const isGameDisabled = () => {
    switch (modo) {
      case 'abracadupla': 
        return duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing';
      case 'abracatetra': 
        return tetraState.status.every(s => s !== 'playing');
      default: 
        if (modo === 'speedrun' && countdown !== null) {
          return true; // Bloqueia durante a contagem regressiva
        }
        return gameState.gameStatus !== 'playing';
    }
  };

  const selectTetraIndex = (index: number) => {
    if (modo === 'abracatetra') tetraSelectIndex(index);
  };

  return (
    <Routes>
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/*" element={
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
          <ModernHeader
            onShowHelp={() => setShowHelp(true)}
            onShowStats={() => {
              setStats(loadStats());
              setShowStats(true);
            }}
            onShowAbout={() => setShowAbout(true)}
            onDueto={iniciarDueto}
            onQuarteto={iniciarTetra}
            onHome={voltarParaNormal}
            onSpeedRun={iniciarSpeedRun}
            stats={stats}
            mode={modo}
            isVimMode={modoComando}
          />
          
          <main className="flex-1 flex flex-col items-center justify-center gap-8 max-w-7xl mx-auto w-full px-4 py-8">
            {countdown !== null && <Countdown count={countdown} />}
            
            {notification && (
              <div className="fixed top-20 right-4 z-40">
                <ModernNotification
                  key={notificationKey}
                  message={notification}
                  type={notificationType}
                />
              </div>
            )}
            
            <div className="w-full flex flex-col items-center justify-center">
              {modo === 'abracadupla' ? (
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full">
                  <DuetoGrid
                    guesses={duetoState.guesses}
                    currentGuess={duetoState.currentGuess}
                    wordLength={5}
                    maxAttempts={7}
                    getLetterStates={g => getDuetoLetterStates(g, duetoState.word1)}
                    isCompleted={duetoState.status1 !== 'playing'}
                    status={duetoState.status1}
                    title="Palavra"
                    gridNumber={1}
                    selectedIndex={duetoState.selectedIndex}
                    selectIndex={selectDuetoIndex}
                    isLastAttempt={duetoState.guesses.length === 6 && duetoState.status1 === 'playing'}
                  />
                  <DuetoGrid
                    guesses={duetoState.guesses}
                    currentGuess={duetoState.currentGuess}
                    wordLength={5}
                    maxAttempts={7}
                    getLetterStates={g => getDuetoLetterStates(g, duetoState.word2)}
                    isCompleted={duetoState.status2 !== 'playing'}
                    status={duetoState.status2}
                    title="Palavra"
                    gridNumber={2}
                    selectedIndex={duetoState.selectedIndex}
                    selectIndex={selectDuetoIndex}
                    isLastAttempt={duetoState.guesses.length === 6 && duetoState.status2 === 'playing'}
                  />
                </div>
              ) : modo === 'abracatetra' ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
                  {tetraState.words.map((word, idx) => (
                    <TetraGrid
                      key={idx}
                      guesses={tetraState.guesses}
                      currentGuess={tetraState.currentGuess}
                      wordLength={5}
                      maxAttempts={9}
                      getLetterStates={g => getTetraLetterStates(g, word)}
                      isCompleted={tetraState.status[idx] !== 'playing'}
                      status={tetraState.status[idx]}
                      title="Palavra"
                      gridNumber={idx + 1}
                      selectedIndex={tetraState.selectedIndex}
                      selectIndex={selectTetraIndex}
                      isLastAttempt={tetraState.guesses.length === 8 && tetraState.status[idx] === 'playing'}
                    />
                  ))}
                </div>
              ) : (
                <ModernGameGrid
                  guesses={gameState.guesses}
                  currentGuess={gameState.currentGuess}
                  wordLength={wordLength}
                  maxAttempts={gameState.maxAttempts}
                  getLetterStates={getLetterStates}
                  isCompleted={false}
                  selectedIndex={selectedIndex}
                  selectIndex={selectIndex}
                  isSpeedRun={modo === 'speedrun'}
                  isSpeedRunActive={isSpeedRunActive}
                  onTimeUpdate={updateSpeedRunTime}
                  isLastAttempt={gameState.guesses.length === gameState.maxAttempts - 1 && gameState.gameStatus === 'playing'}
                  shouldExplode={shouldExplode}
                />
              )}
            </div>
            
            {modo === 'normal' && gameState.gameStatus === 'playing' && (
              <ModernSpellbook 
                onCastRevealLetter={castRevealLetterSpell}
                canCastRevealLetter={getRevealablePosition() !== null}
                mana={stats.mana}
                spellUses={revealSpellUses}
              />
            )}
            
            <ModernKeyboard
              keyboardStates={getCurrentKeyboardStates()}
              onKeyPress={getCurrentAddLetter()}
              onDelete={getCurrentRemoveLetter()}
              onEnter={getCurrentSubmitGuess()}
              disabled={isGameDisabled()}
              isVimMode={modoComando}
            />

            {/* Modal de vitória/derrota para modo dueto */}
            {modo === 'abracadupla' && (duetoState.status1 !== 'playing' && duetoState.status2 !== 'playing') && (
              <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
                <div className="card-elevated p-6 rounded-2xl min-w-[320px] max-w-md w-full mx-4 animate-scale-in">
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-bold text-gradient">
                      Abracadupla finalizado!
                    </h3>
                    <div className="space-y-2">
                      <p className="text-[var(--text-primary)]">
                        Palavra 1: <span onClick={() => fetchMeaning(duetoState.word1)} className="font-bold text-[var(--success)] cursor-pointer hover:underline">{duetoState.word1}</span> - {duetoState.status1 === 'won' ? '✅ Acertou!' : '❌ Errou!'}
                      </p>
                      <p className="text-[var(--text-primary)]">
                        Palavra 2: <span onClick={() => fetchMeaning(duetoState.word2)} className="font-bold text-[var(--success)] cursor-pointer hover:underline">{duetoState.word2}</span> - {duetoState.status2 === 'won' ? '✅ Acertou!' : '❌ Errou!'}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">(Clique na palavra para ver o significado)</p>
                  </div>
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={restartDueto}
                      className="btn-primary py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Play size={16} />
                      Jogar Novamente
                    </button>
                    <button
                      onClick={voltarParaNormal}
                      className="btn-secondary py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Home size={16} />
                      Modo Normal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de vitória/derrota para modo abracatetra */}
            {modo === 'abracatetra' && tetraState.status.every(s => s !== 'playing') && (
              <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
                <div className="card-elevated p-6 rounded-2xl min-w-[320px] max-w-md w-full mx-4 animate-scale-in">
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-bold text-gradient">
                      Abracatetra finalizado!
                    </h3>
                    <div className="space-y-2">
                      {tetraState.words.map((word, idx) => (
                        <p key={idx} className="text-[var(--text-primary)]">
                          Palavra {idx + 1}: <span onClick={() => fetchMeaning(word)} className="font-bold text-[var(--success)] cursor-pointer hover:underline">{word}</span> - {tetraState.status[idx] === 'won' ? '✅ Acertou!' : '❌ Errou!'}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">(Clique na palavra para ver o significado)</p>
                  </div>
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={restartTetra}
                      className="btn-primary py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Play size={16} />
                      Jogar Novamente
                    </button>
                    <button
                      onClick={voltarParaNormal}
                      className="btn-secondary py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Home size={16} />
                      Modo Normal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de vitória/derrota para modo normal e speedrun */}
            {(modo === 'normal' || modo === 'speedrun') && gameState.gameStatus !== 'playing' && showVictoryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
                <div className="card-elevated p-6 rounded-2xl min-w-[320px] max-w-md w-full mx-4 animate-scale-in">
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-bold text-gradient">
                      {gameState.gameStatus === 'won' ? (
                        <>
                          {gameState.guesses.length === 1 ? (
                            <>🎉 Parabéns! <span className="text-3xl">THE GOAT 🐐</span></>
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
                    <p className="text-[var(--text-primary)]">
                      {gameState.gameStatus === 'won' ? (
                        <>
                          {modo === 'speedrun' && gameState.speedRunTime ? (
                            <>Você completou em {formatTime(gameState.speedRunTime)}!<br />
                            Tentativas: {gameState.guesses.length}<br />
                            Palavra: <span className="font-bold text-[var(--success)]">{palavraCorreta}</span></>
                          ) : (
                            <>Você descobriu a palavra em {gameState.guesses.length} tentativa{gameState.guesses.length !== 1 ? 's' : ''}!<br />
                            Palavra: <span className="font-bold text-[var(--success)]">{palavraCorreta}</span></>
                          )}
                        </>
                      ) : (
                        <>A palavra era: <span className="font-bold text-[var(--success)]">{palavraCorreta}</span></>
                      )}
                    </p>
                  </div>
                  {modo === 'speedrun' ? (
                    <div className="flex flex-col gap-3 mt-6">
                      <div className="flex gap-3">
                        <button
                          onClick={voltarParaNormal}
                          className="flex-1 btn-secondary py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                          <Home size={16} />
                          Modo Normal
                        </button>
                        <button
                          onClick={restartGame}
                          className="flex-1 btn-primary py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                          <Play size={16} />
                          Jogar Novamente
                        </button>
                      </div>
                      <button
                        onClick={() => fetchMeaning(palavraCorreta)}
                        className="w-full py-3 px-5 rounded-xl bg-[var(--success)] text-[var(--bg-primary)] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <BookOpen size={16} />
                        Ver significado no Wiktionary
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 mt-6">
                      <button
                        onClick={restartGame}
                        className="btn-primary py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        <Play size={16} />
                        Jogar Novamente
                      </button>
                      {gameState.gameStatus === 'won' && (
                        <button
                          onClick={() => fetchMeaning(palavraCorreta)}
                          className="w-full py-3 px-5 rounded-xl bg-[var(--success)] text-[var(--bg-primary)] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <BookOpen size={16} />
                          Ver significado no Wiktionary
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {modoComando && (
              <>
                {/* Overlay para capturar foco e impedir interação */}
                <div
                  tabIndex={0}
                  className="console-overlay fixed inset-0 z-40"
                  onClick={e => { e.preventDefault(); inputRef.current?.focus(); }}
                  onFocus={() => inputRef.current?.focus()}
                />
                {/* Linha de comando estilo Vim no footer */}
                <div className="console-input fixed left-0 right-0 bottom-0 z-50 w-full flex items-center px-4 py-3">
                  <span className="console-prompt text-xl mr-2 font-mono">:</span>
                  <input
                    ref={inputRef}
                    className="bg-transparent border-none outline-none text-[var(--text-primary)] font-mono text-xl flex-1"
                    value={comando}
                    onChange={e => setComando(e.target.value)}
                    onKeyDown={processarComando}
                    autoFocus
                    spellCheck={false}
                  />
                  <span className="ml-4 text-[var(--text-secondary)] font-mono text-xs hidden sm:block">
                    <b>q!</b> (reiniciar), <b>admin</b> (resposta), <b>magiaadmin</b> (mana), <b>Esc</b> (cancelar)
                  </span>
                </div>
              </>
            )}
            
            {/* Modal de significado */}
            {showMeaning && (
              <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
                <div className="modal max-w-4xl w-full h-[80vh] mx-4 flex flex-col">
                  <div className="modal-header p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Significado de "{wordToSearch}"</h2>
                    <button
                      onClick={() => setShowMeaning(false)}
                      className="btn-ghost p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <iframe
                      src={`https://pt.wiktionary.org/wiki/${wordToSearch.toLowerCase()}`}
                      className="w-full h-full border border-[var(--border-primary)] rounded-xl"
                      title={`Significado de ${wordToSearch}`}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <SpeedRunHelpModal
              isOpen={showSpeedRunHelp}
              onClose={() => setShowSpeedRunHelp(false)}
              onStart={comecarSpeedRun}
              onNormalMode={() => {
                setShowSpeedRunHelp(false);
                voltarParaNormal();
              }}
            />
            
            <DuetoHelpModal
              isOpen={showDuetoHelp}
              onClose={() => setShowDuetoHelp(false)}
              onStart={comecarDueto}
              onNormalMode={() => {
                setShowDuetoHelp(false);
                voltarParaNormal();
              }}
            />
            
            <TetraHelpModal
              isOpen={showTetraHelp}
              onClose={() => setShowTetraHelp(false)}
              onStart={comecarTetra}
              onNormalMode={() => {
                setShowTetraHelp(false);
                voltarParaNormal();
              }}
            />
            
            <StatsModal
              isOpen={showStats}
              onClose={() => setShowStats(false)}
              stats={stats}
            />
            <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
            
            {mascotMessage && <ModernMascot key={mascotKey} message={mascotMessage} isCastingSpell={isCastingSpell} />}
          </main>
          
          <HelpModal
            isOpen={showHelp}
            onClose={() => setShowHelp(false)}
            startTour={() => setTourOpen(true)}
          />
        </div>
      } />
    </Routes>
  );
}

export default App;