export interface GameStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
  failures: number;
}

const STATS_KEY = 'palavrimGameStats';

export const getInitialStats = (): GameStats => ({
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  failures: 0,
});

export const loadStats = (): GameStats => {
  const statsString = localStorage.getItem(STATS_KEY);
  return statsString ? JSON.parse(statsString) : getInitialStats();
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const addGameResult = (result: 'win' | 'loss', guessCount: number) => {
  const stats = loadStats();

  stats.gamesPlayed += 1;

  if (result === 'win') {
    stats.wins += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
    if (guessCount >= 1 && guessCount <= 6) {
      stats.guessDistribution[guessCount as keyof typeof stats.guessDistribution] += 1;
    }
  } else {
    stats.currentStreak = 0;
    stats.failures += 1;
  }

  saveStats(stats);
}; 