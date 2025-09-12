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
  obstacle?: Obstacle;
}

export interface Obstacle {
  type: ObstacleType;
  health: number;
  maxHealth: number;
}

export enum ObstacleType {
  LOCKED = 'locked',
  STONE = 'stone',
  ICE = 'ice',
  CHOCOLATE = 'chocolate',
  WOOD = 'wood',
  METAL = 'metal'
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
  MULTIPLIER = 'multiplier',
  ROW_CLEAR = 'row_clear',
  COLUMN_CLEAR = 'column_clear',
  EXPLOSIVE = 'explosive',
  COLOR_BOMB = 'color_bomb'
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
  obstacles?: ObstacleConfig[];
  boardSize?: { rows: number; cols: number };
  gameMode: 'score' | 'clear_obstacles' | 'collect_items' | 'survive_time' | 'mixed';
}

export interface ObstacleConfig {
  type: ObstacleType;
  position: Position;
  health: number;
}

export interface Objective {
  type: 'score' | 'clear_gems' | 'collect_items' | 'survive_time' | 'clear_obstacles';
  target: number;
  description: string;
  gemType?: GemType;
  obstacleType?: ObstacleType;
  completed: boolean;
  current: number;
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
