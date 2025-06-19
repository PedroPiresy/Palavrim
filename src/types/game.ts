export interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  maxAttempts: number;
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