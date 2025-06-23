// Interface para dados semanais do jogador
export interface WeeklyData {
  weekStartDate: string;        // Data de início da semana (YYYY-MM-DD)
  gamesPlayed: number;          // Jogos jogados na semana
  gamesWon: number;             // Jogos ganhos na semana
  totalAttemptsOnWin: number;   // Total de tentativas nos jogos ganhos
}

// Interface principal com todas as estatísticas do jogador
export interface GameStats {
  gamesPlayed: number;          // Total de jogos jogados
  gamesWon: number;             // Total de jogos ganhos
  winStreak: number;            // Sequência atual de vitórias
  maxWinStreak: number;         // Maior sequência de vitórias já alcançada
  guesses: { [key: number]: number };  // Contador de tentativas (1-6 tentativas)
  totalAttemptsOnWin: number;   // Total de tentativas em jogos ganhos
  letterFrequency: { [key: string]: number };  // Frequência de uso de cada letra
  weeklyEvolution: WeeklyData[]; // Evolução semanal dos últimos 12 meses
  lastPlayed: string;           // Última data jogada
  lastWon: string;              // Última data que ganhou
  lastDailyBonus: string;       // Última data que recebeu bônus diário
  xp: number;                   // Pontos de experiência atuais
  level: number;                // Nível atual do jogador
  rank: string;                 // Título/rank atual (ex: "Aprendiz de Letras")
  mana: number;                 // Mana atual (para modos especiais)
}

// Lista de todos os ranks/títulos possíveis no jogo
export const ranks = [
  "Aprendiz de Letras",         // Nível 1-4
  "Iniciado das Sílabas",       // Nível 5-9
  "Mago das Palavras",          // Nível 10-14
  "Feiticeiro Ortográfico",     // Nível 15-19
  "Arquimago do Dicionário",    // Nível 20-24
  "Lorde do Léxico",            // Nível 25-29
  "Semideus da Semântica",      // Nível 30-39
  "Avatar do Alfabeto",         // Nível 40+
];

// Função que determina qual rank o jogador tem baseado no nível
export const getRankForLevel = (level: number): string => {
  if (level >= 40) return ranks[7];  // Avatar do Alfabeto
  if (level >= 30) return ranks[6];  // Semideus da Semântica
  if (level >= 25) return ranks[5];  // Lorde do Léxico
  if (level >= 20) return ranks[4];  // Arquimago do Dicionário
  if (level >= 15) return ranks[3];  // Feiticeiro Ortográfico
  if (level >= 10) return ranks[2];  // Mago das Palavras
  if (level >= 5) return ranks[1];   // Iniciado das Sílabas
  return ranks[0];                   // Aprendiz de Letras
};

// Calcula quantos XP são necessários para o próximo nível
// A fórmula usa uma progressão exponencial: 250 * nível^1.5
export const getXpForNextLevel = (level: number): number => {
  return Math.floor(250 * Math.pow(level, 1.5));
};

// Cria estatísticas iniciais para um novo jogador
export const getInitialStats = (): GameStats => {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    winStreak: 0,
    maxWinStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }, // Inicializa contadores de tentativas
    totalAttemptsOnWin: 0,
    letterFrequency: {},
    weeklyEvolution: [],
    lastPlayed: '',
    lastWon: '',
    lastDailyBonus: '',
    xp: 0,
    level: 1,
    rank: getRankForLevel(1), // Começa como "Aprendiz de Letras"
    mana: 100, // Mana inicial
  };
};

// Carrega estatísticas salvas do localStorage
export const loadStats = (): GameStats => {
  const initialStats = getInitialStats();
  const statsJson = localStorage.getItem('gameStats');
  if (statsJson) {
    const loaded = JSON.parse(statsJson);
    // Mescla as estatísticas salvas com as iniciais para garantir que todos os campos existam
    return { ...initialStats, ...loaded };
  }
  return initialStats;
};

// Salva estatísticas no localStorage
export const saveStats = (stats: GameStats) => {
  localStorage.setItem('gameStats', JSON.stringify(stats));
};

// Calcula XP ganho baseado no número de tentativas
// Quanto menos tentativas, mais XP ganha
export const calculateXpGained = (guesses: number): number => {
  const base_xp = 150;           // XP base por vitória
  const penalty = (guesses - 1) * 20; // Penalidade de 20 XP por tentativa extra
  return Math.max(20, base_xp - penalty); // Mínimo de 20 XP
};

// Função para aplicar XP e gerenciar subida de nível
export const applyXp = (stats: GameStats, xpToAdd: number): { newStats: GameStats; leveledUp: boolean } => {
  const newStats = { ...stats, xp: stats.xp + xpToAdd };

  const oldLevel = newStats.level;
  let xpForNext = getXpForNextLevel(newStats.level);

  // Loop para subir de nível
  while (newStats.xp >= xpForNext) {
    newStats.level++;
    newStats.xp -= xpForNext;
    xpForNext = getXpForNextLevel(newStats.level);
  }

  const leveledUp = newStats.level > oldLevel;
  if (leveledUp) {
    // Recompensa por subir de nível
    newStats.mana = Math.min(newStats.mana + 50, 100);
    // Atualiza o rank do jogador
    newStats.rank = getRankForLevel(newStats.level);
  }

  return { newStats, leveledUp };
};

// Função para aplicar XP de vitória e gerenciar subida de nível
const applyXpAndLevelUp = (stats: GameStats, guessCount: number): { newStats: GameStats; leveledUp: boolean, xpGained: number } => {
  const xpGained = calculateXpGained(guessCount);
  const { newStats, leveledUp } = applyXp(stats, xpGained);
  return { newStats, leveledUp, xpGained };
};

// Atualiza estatísticas quando o jogador ganha (jogo completo)
export const updateStatsOnWin = (stats: GameStats, guessCount: number): { newStats: GameStats; leveledUp: boolean, xpGained: number } => {
  const newStats = { ...stats };
  
  newStats.gamesPlayed++;
  newStats.gamesWon++;
  newStats.winStreak++;
  newStats.totalAttemptsOnWin += guessCount;
  
  if (newStats.winStreak > newStats.maxWinStreak) {
    newStats.maxWinStreak = newStats.winStreak;
  }
  
  if (guessCount <= 6) {
    newStats.guesses[guessCount as keyof typeof newStats.guesses]++;
  }
  
  newStats.lastPlayed = new Date().toISOString().split('T')[0];
  newStats.lastWon = new Date().toISOString().split('T')[0];
  
  const currentWeek = newStats.weeklyEvolution.find(w => w.weekStartDate === updateWeeklyEvolution(newStats).weeklyEvolution.slice(-1)[0].weekStartDate);
  if (currentWeek) {
    currentWeek.gamesPlayed++;
    currentWeek.gamesWon++;
    currentWeek.totalAttemptsOnWin += guessCount;
  }

  // Aplica XP e lida com o level up
  return applyXpAndLevelUp(newStats, guessCount);
};

// Atualiza estatísticas ao vencer uma única palavra (Dueto/Tetra)
export const updateStatsOnWordWin = (stats: GameStats, guessCount: number): { newStats: GameStats; leveledUp: boolean, xpGained: number } => {
  // Apenas dá XP, não mexe nas estatísticas de jogo (partidas, vitórias, etc.)
  return applyXpAndLevelUp(stats, guessCount);
};

// Atualiza estatísticas quando o jogador perde
export const updateStatsOnLoss = (stats: GameStats): GameStats => {
  const newStats = { ...stats };
  newStats.gamesPlayed++;
  newStats.winStreak = 0; // Reseta sequência de vitórias
  newStats.lastPlayed = new Date().toISOString().split('T')[0];

  // Atualiza estatísticas semanais
  const currentWeek = newStats.weeklyEvolution.find(w => w.weekStartDate === updateWeeklyEvolution(newStats).weeklyEvolution.slice(-1)[0].weekStartDate);
  if (currentWeek) {
    currentWeek.gamesPlayed++;
  }

  return newStats;
};

// Atualiza a frequência de uso de cada letra
export const updateLetterFrequency = (stats: GameStats, guess: string): GameStats => {
  const newStats = { ...stats };
  if (!newStats.letterFrequency) {
    newStats.letterFrequency = {}; // Garante que o objeto exista
  }

  // Conta cada letra da tentativa
  for (const letter of guess.toUpperCase()) {
    newStats.letterFrequency[letter] = (newStats.letterFrequency[letter] || 0) + 1;
  }
  return newStats;
};

// Gerencia a evolução semanal das estatísticas
export const updateWeeklyEvolution = (stats: GameStats): GameStats => {
  const newStats = { ...stats };
  if (!newStats.weeklyEvolution) {
    newStats.weeklyEvolution = [];
  }

  // Calcula a data de início da semana atual (segunda-feira)
  const today = new Date();
  const weekDay = today.getDay(); // 0 = Domingo, 1 = Segunda, ...
  const mostRecentMonday = new Date(today);
  mostRecentMonday.setDate(today.getDate() - (weekDay === 0 ? 6 : weekDay - 1));
  const weekStartDate = mostRecentMonday.toISOString().split('T')[0];

  // Procura se já existe dados para esta semana
  let currentWeekData = newStats.weeklyEvolution.find(w => w.weekStartDate === weekStartDate);

  // Se não existe, cria uma nova entrada para a semana
  if (!currentWeekData) {
    currentWeekData = {
      weekStartDate,
      gamesPlayed: 0,
      gamesWon: 0,
      totalAttemptsOnWin: 0
    };
    newStats.weeklyEvolution.push(currentWeekData);
    
    // Mantém apenas as últimas 12 semanas (3 meses)
    if (newStats.weeklyEvolution.length > 12) {
      newStats.weeklyEvolution.shift();
    }
  }
  
  return newStats;
}; 