export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  winStreak: number;
  maxWinStreak: number;
  guesses: { [key: number]: number };
  lastPlayed: string;
  lastWon: string;
  lastDailyBonus: string;
  xp: number;
  level: number;
  rank: string;
  mana: number;
}

export const ranks = [
  "Aprendiz de Letras", // Nível 1-4
  "Iniciado das Sílabas", // Nível 5-9
  "Mago das Palavras", // Nível 10-14
  "Feiticeiro Ortográfico", // Nível 15-19
  "Arquimago do Dicionário", // Nível 20-24
  "Lorde do Léxico", // Nível 25-29
  "Semideus da Semântica", // Nível 30-39
  "Avatar do Alfabeto", // Nível 40+
];

// Helper to get rank based on level
export const getRankForLevel = (level: number): string => {
  if (level >= 40) return ranks[7];
  if (level >= 30) return ranks[6];
  if (level >= 25) return ranks[5];
  if (level >= 20) return ranks[4];
  if (level >= 15) return ranks[3];
  if (level >= 10) return ranks[2];
  if (level >= 5) return ranks[1];
  return ranks[0];
};

export const getXpForNextLevel = (level: number): number => {
  return Math.floor(250 * Math.pow(level, 1.5));
};

export const getInitialStats = (): GameStats => {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    winStreak: 0,
    maxWinStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    lastPlayed: '',
    lastWon: '',
    lastDailyBonus: '',
    xp: 0,
    level: 1,
    rank: getRankForLevel(1),
    mana: 100, // Starting mana
  };
};

export const loadStats = (): GameStats => {
  const statsJson = localStorage.getItem('gameStats');
  return statsJson ? JSON.parse(statsJson) : getInitialStats();
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem('gameStats', JSON.stringify(stats));
};

export const calculateXpGained = (guesses: number): number => {
  const base_xp = 150;
  const penalty = (guesses - 1) * 20;
  return Math.max(20, base_xp - penalty);
};

export const updateStatsOnWin = (stats: GameStats, guessCount: number): { newStats: GameStats; leveledUp: boolean, xpGained: number } => {
  const newStats = { ...stats };
  
  // Update standard stats
  newStats.gamesPlayed++;
  newStats.gamesWon++;
  newStats.winStreak++;
  if (newStats.winStreak > newStats.maxWinStreak) {
    newStats.maxWinStreak = newStats.winStreak;
  }
  if (guessCount <= 6) {
    newStats.guesses[guessCount as keyof typeof newStats.guesses]++;
  }
  newStats.lastPlayed = new Date().toISOString().split('T')[0];
  newStats.lastWon = new Date().toISOString().split('T')[0];
  
  // Add XP
  const xpGained = calculateXpGained(guessCount);
  newStats.xp += xpGained;
  
  // Check for level up
  const oldLevel = newStats.level;
  let xpForNext = getXpForNextLevel(newStats.level);
  while (newStats.xp >= xpForNext) {
    newStats.level++;
    newStats.xp -= xpForNext;
    xpForNext = getXpForNextLevel(newStats.level);
  }
  
  newStats.rank = getRankForLevel(newStats.level);
  
  const leveledUp = newStats.level > oldLevel;
  
  // Add 50 mana on level up, capped at 100
  if (leveledUp) {
    newStats.mana = Math.min(newStats.mana + 50, 100);
  }
  
  return { newStats, leveledUp, xpGained };
};

export const updateStatsOnLoss = (stats: GameStats): GameStats => {
  const newStats = { ...stats };
  newStats.gamesPlayed++;
  newStats.winStreak = 0;
  newStats.lastPlayed = new Date().toISOString().split('T')[0];
  return newStats;
}; 