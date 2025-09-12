// Game Types and Interfaces for GemCraft

export interface Position {
  row: number;
  col: number;
}

export interface Gem {
  id: string;
  type: GemType;
  position: Position;
  isSpecial?: boolean;
  specialType?: SpecialGemType;
}

export enum GemType {
  RUBY = 'ruby',
  EMERALD = 'emerald',
  SAPPHIRE = 'sapphire',
  DIAMOND = 'diamond',
  AMETHYST = 'amethyst',
  TOPAZ = 'topaz',
  GOLD = 'gold',
  SILVER = 'silver'
}

export enum SpecialGemType {
  BOMB = 'bomb',
  LIGHTNING = 'lightning',
  RAINBOW = 'rainbow',
  MULTIPLIER = 'multiplier'
}

export interface Match {
  gems: Gem[];
  type: 'horizontal' | 'vertical' | 'l_shape' | 't_shape';
  length: number;
}

export interface GameBoard {
  gems: Gem[][];
  rows: number;
  cols: number;
}

export interface GameState {
  board: GameBoard;
  score: number;
  moves: number;
  level: number;
  targetScore: number;
  timeLeft?: number;
  isGameOver: boolean;
  isPaused: boolean;
  selectedGem?: Position;
  possibleMoves: Position[][];
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  targetScore: number;
  moves: number;
  timeLimit?: number;
  specialObjectives?: Objective[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  rewards: {
    cUSD: number;
    gems: number;
    nftChance: number;
  };
}

export interface Objective {
  type: 'score' | 'clear_gems' | 'collect_items' | 'survive_time';
  target: number;
  description: string;
  gemType?: GemType;
  completed: boolean;
}

export interface GameStats {
  totalScore: number;
  levelsCompleted: number;
  gemsCollected: number;
  powerUpsUsed: number;
  bestCombo: number;
  playTime: number;
}

export interface SwapResult {
  success: boolean;
  matches: Match[];
  newBoard: GameBoard;
  scoreGained: number;
  cascades: number;
}

export interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

export interface ParticleEffect {
  type: 'explosion' | 'sparkle' | 'lightning' | 'rainbow';
  position: Position;
  color: string;
  duration: number;
  intensity: number;
}
