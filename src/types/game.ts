// Game Types
export type GemType = 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz' | 'special';

export type GemPower = 'normal' | 'row_clear' | 'column_clear' | 'explosive' | 'color_bomb';

export interface Gem {
  id: string;
  type: GemType;
  power: GemPower;
  x: number;
  y: number;
  isAnimating?: boolean;
  isMatched?: boolean;
}

export interface GameBoard {
  gems: Gem[][];
  width: number;
  height: number;
}

export interface Match {
  gems: Gem[];
  type: 'horizontal' | 'vertical' | 'l_shape' | 't_shape' | 'five_in_row';
  power?: GemPower;
}

export interface GameState {
  board: GameBoard;
  score: number;
  moves: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
  selectedGem: Gem | null;
  matches: Match[];
  combos: number;
  targetScore?: number;
  timeLimit?: number;
  timeRemaining?: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  targetScore: number;
  moves: number;
  timeLimit?: number;
  obstacles?: Obstacle[];
  specialGems?: GemType[];
  description: string;
  unlocked: boolean;
  stars: number;
}

export interface Obstacle {
  type: 'locked' | 'stone' | 'ice' | 'chocolate';
  x: number;
  y: number;
  health?: number;
}

export interface PowerUp {
  type: GemPower;
  count: number;
  description: string;
  icon: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'dark' | 'light';
}

export interface PlayerStats {
  totalScore: number;
  levelsCompleted: number;
  totalMatches: number;
  totalCombos: number;
  playTime: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  reward?: {
    type: 'token' | 'nft' | 'powerup';
    amount?: number;
    tokenType?: string;
  };
}

export interface GameEvent {
  type: 'match' | 'combo' | 'powerup' | 'level_complete' | 'game_over';
  data: any;
  timestamp: Date;
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

export interface GemAnimation {
  gem: Gem;
  type: 'move' | 'pop' | 'fall' | 'spawn' | 'powerup';
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  config: AnimationConfig;
}

// Blockchain Types
export interface BlockchainReward {
  type: 'token' | 'nft';
  amount?: number;
  tokenType: 'CELO' | 'cUSD' | 'cEUR';
  nftId?: string;
  transactionHash?: string;
}

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance: {
    CELO: string;
    cUSD: string;
    cEUR: string;
  };
}

export interface LeaderboardEntry {
  address: string;
  score: number;
  level: number;
  timestamp: Date;
  rank: number;
}
