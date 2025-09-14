import { LevelConfig } from '../types/GameTypes';

export const testLevels: LevelConfig[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first match-3 puzzle and earn your first cUSD rewards!",
    targetScore: 1000,
    moves: 20,
    timeLimit: 120,
    difficulty: 'easy',
    rewards: {
      cUSD: 0.1,
      gems: 10,
      nftChance: 1
    },
    gameMode: 'score',
    boardSize: { rows: 6, cols: 6 }
  },
  {
    id: 2,
    name: "Power-Up Discovery",
    description: "Create your first power-up by matching 4 gems in a row!",
    targetScore: 2000,
    moves: 25,
    timeLimit: 150,
    difficulty: 'easy',
    rewards: {
      cUSD: 0.2,
      gems: 20,
      nftChance: 2
    },
    gameMode: 'score',
    boardSize: { rows: 7, cols: 7 }
  },
  {
    id: 3,
    name: "Cascade Master",
    description: "Create cascading matches to achieve a high score multiplier!",
    targetScore: 3000,
    moves: 30,
    timeLimit: 180,
    difficulty: 'easy',
    rewards: {
      cUSD: 0.3,
      gems: 30,
      nftChance: 3
    },
    gameMode: 'score',
    boardSize: { rows: 8, cols: 8 }
  },
  {
    id: 4,
    name: "L-Shape Challenge",
    description: "Master the L-shape pattern to create explosive power-ups!",
    targetScore: 5000,
    moves: 25,
    timeLimit: 200,
    difficulty: 'medium',
    rewards: {
      cUSD: 0.5,
      gems: 50,
      nftChance: 5
    },
    gameMode: 'score',
    boardSize: { rows: 8, cols: 8 }
  },
  {
    id: 5,
    name: "T-Shape Expert",
    description: "Create T-shape patterns for maximum impact and rewards!",
    targetScore: 7000,
    moves: 30,
    timeLimit: 220,
    difficulty: 'medium',
    rewards: {
      cUSD: 0.7,
      gems: 70,
      nftChance: 7
    },
    gameMode: 'score',
    boardSize: { rows: 8, cols: 8 }
  },
  {
    id: 6,
    name: "Color Bomb Factory",
    description: "Match 5+ gems to create powerful color bombs!",
    targetScore: 10000,
    moves: 35,
    timeLimit: 250,
    difficulty: 'medium',
    rewards: {
      cUSD: 1.0,
      gems: 100,
      nftChance: 10
    },
    gameMode: 'score',
    boardSize: { rows: 8, cols: 8 }
  },
  {
    id: 7,
    name: "Obstacle Breaker",
    description: "Clear locked tiles and stone obstacles to reach your target!",
    targetScore: 8000,
    moves: 30,
    timeLimit: 200,
    difficulty: 'hard',
    rewards: {
      cUSD: 1.5,
      gems: 150,
      nftChance: 15
    },
    gameMode: 'clear_obstacles',
    boardSize: { rows: 8, cols: 8 },
    obstacles: [
      { type: 'locked', position: { row: 2, col: 2 }, health: 1 },
      { type: 'locked', position: { row: 2, col: 5 }, health: 1 },
      { type: 'stone', position: { row: 5, col: 2 }, health: 2 },
      { type: 'stone', position: { row: 5, col: 5 }, health: 2 }
    ]
  },
  {
    id: 8,
    name: "Ice Melter",
    description: "Melt all ice obstacles using strategic gem matches!",
    targetScore: 6000,
    moves: 25,
    timeLimit: 180,
    difficulty: 'hard',
    rewards: {
      cUSD: 2.0,
      gems: 200,
      nftChance: 20
    },
    gameMode: 'clear_obstacles',
    boardSize: { rows: 8, cols: 8 },
    obstacles: [
      { type: 'ice', position: { row: 1, col: 1 }, health: 1 },
      { type: 'ice', position: { row: 1, col: 6 }, health: 1 },
      { type: 'ice', position: { row: 6, col: 1 }, health: 1 },
      { type: 'ice', position: { row: 6, col: 6 }, health: 1 },
      { type: 'ice', position: { row: 3, col: 3 }, health: 1 },
      { type: 'ice', position: { row: 3, col: 4 }, health: 1 },
      { type: 'ice', position: { row: 4, col: 3 }, health: 1 },
      { type: 'ice', position: { row: 4, col: 4 }, health: 1 }
    ]
  },
  {
    id: 9,
    name: "Gem Collector",
    description: "Collect 50 Ruby gems while achieving a high score!",
    targetScore: 5000,
    moves: 40,
    timeLimit: 300,
    difficulty: 'hard',
    rewards: {
      cUSD: 3.0,
      gems: 300,
      nftChance: 30
    },
    gameMode: 'collect_items',
    boardSize: { rows: 8, cols: 8 },
    specialObjectives: [
      {
        type: 'collect_items',
        target: 50,
        description: 'Collect 50 Ruby gems',
        gemType: 'ruby',
        completed: false,
        current: 0
      }
    ]
  },
  {
    id: 10,
    name: "Legendary Challenge",
    description: "The ultimate test! Complete all objectives and earn legendary rewards!",
    targetScore: 15000,
    moves: 50,
    timeLimit: 400,
    difficulty: 'expert',
    rewards: {
      cUSD: 5.0,
      gems: 500,
      nftChance: 50
    },
    gameMode: 'mixed',
    boardSize: { rows: 8, cols: 8 },
    obstacles: [
      { type: 'locked', position: { row: 1, col: 1 }, health: 1 },
      { type: 'stone', position: { row: 1, col: 6 }, health: 2 },
      { type: 'ice', position: { row: 6, col: 1 }, health: 1 },
      { type: 'metal', position: { row: 6, col: 6 }, health: 3 }
    ],
    specialObjectives: [
      {
        type: 'collect_items',
        target: 30,
        description: 'Collect 30 Diamond gems',
        gemType: 'diamond',
        completed: false,
        current: 0
      },
      {
        type: 'clear_obstacles',
        target: 4,
        description: 'Clear all obstacles',
        completed: false,
        current: 0
      }
    ]
  }
];

export const getLevelById = (id: number): LevelConfig | undefined => {
  return testLevels.find(level => level.id === id);
};

export const getUnlockedLevels = (completedLevels: number[]): LevelConfig[] => {
  return testLevels.filter(level => 
    level.id === 1 || completedLevels.includes(level.id - 1)
  );
};
