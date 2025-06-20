export interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  maxAttempts: number;
  isSpeedRun?: boolean;
  speedRunTime?: number;
}

export interface LetterState {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}

export interface KeyboardKey {
  key: string;
  status: 'correct' | 'present' | 'absent' | 'unused';
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface SpeedRunStats {
  time: number;
  attempts: number;
  word: string;
}