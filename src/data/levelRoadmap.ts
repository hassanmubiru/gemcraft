// 100-Level Gameplay Roadmap Configuration
// Rule: No mocking or automated shortcuts. Players must achieve all objectives by real gameplay.

export interface LevelObjective {
  type: 'score' | 'collect' | 'clear' | 'time' | 'moves' | 'combo' | 'special';
  target: number;
  description: string;
  gemType?: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  gridSize: { width: number; height: number };
  gemColors: number;
  objectives: LevelObjective[];
  timeLimit?: number;
  moveLimit?: number;
  mechanics: string[];
  powerUps: string[];
  obstacles: string[];
  blockchainReward?: {
    cUSD: number;
    gems: number;
    nftChance: number;
    specialReward?: string;
  };
  difficulty: 'tutorial' | 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
}

// Levels 1-10: Tutorial & Basics
export const tutorialLevels: LevelConfig[] = [
  {
    id: 1,
    name: "First Steps",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'score', target: 1000, description: "Reach 1,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: [],
    obstacles: [],
    difficulty: 'tutorial'
  },
  {
    id: 2,
    name: "Power Discovery",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'score', target: 1500, description: "Reach 1,500 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear"],
    obstacles: [],
    difficulty: 'tutorial'
  },
  {
    id: 3,
    name: "Bomb Basics",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'score', target: 2000, description: "Reach 2,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'tutorial'
  },
  {
    id: 4,
    name: "Locked Tiles",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'clear', target: 5, description: "Clear 5 locked tiles" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["locked_tiles"],
    difficulty: 'tutorial'
  },
  {
    id: 5,
    name: "Gem Collection",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'collect', target: 20, description: "Collect 20 Ruby gems", gemType: "ruby" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'tutorial'
  },
  {
    id: 6,
    name: "Mixed Objectives",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'score', target: 2500, description: "Reach 2,500 points" },
      { type: 'collect', target: 15, description: "Collect 15 Sapphire gems", gemType: "sapphire" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'tutorial'
  },
  {
    id: 7,
    name: "More Locks",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'clear', target: 8, description: "Clear 8 locked tiles" },
      { type: 'score', target: 2000, description: "Reach 2,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["locked_tiles"],
    difficulty: 'tutorial'
  },
  {
    id: 8,
    name: "Power Combo",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'score', target: 3000, description: "Reach 3,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["locked_tiles"],
    difficulty: 'tutorial'
  },
  {
    id: 9,
    name: "Triple Challenge",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'score', target: 2500, description: "Reach 2,500 points" },
      { type: 'collect', target: 25, description: "Collect 25 Emerald gems", gemType: "emerald" },
      { type: 'clear', target: 6, description: "Clear 6 locked tiles" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["locked_tiles"],
    difficulty: 'tutorial'
  },
  {
    id: 10,
    name: "Tutorial Master",
    gridSize: { width: 8, height: 8 },
    gemColors: 4,
    objectives: [
      { type: 'score', target: 4000, description: "Reach 4,000 points" },
      { type: 'collect', target: 30, description: "Collect 30 Topaz gems", gemType: "topaz" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["locked_tiles"],
    difficulty: 'tutorial'
  }
];

// Levels 11-20: Beginner Challenges
export const beginnerLevels: LevelConfig[] = [
  {
    id: 11,
    name: "Five Colors",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 3000, description: "Reach 3,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'beginner'
  },
  {
    id: 12,
    name: "Timed Challenge",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 2500, description: "Reach 2,500 points" }
    ],
    timeLimit: 60,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'beginner'
  },
  {
    id: 13,
    name: "Move Master",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 2000, description: "Reach 2,000 points" }
    ],
    moveLimit: 25,
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'beginner'
  },
  {
    id: 14,
    name: "Blockers Arrive",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 10, description: "Clear 10 stone blockers" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["stone_blockers"],
    difficulty: 'beginner'
  },
  {
    id: 15,
    name: "Multi-Objective",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 3000, description: "Reach 3,000 points" },
      { type: 'collect', target: 20, description: "Collect 20 Diamond gems", gemType: "diamond" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["stone_blockers"],
    difficulty: 'beginner'
  },
  {
    id: 16,
    name: "Timed + Moves",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 2500, description: "Reach 2,500 points" }
    ],
    timeLimit: 45,
    moveLimit: 20,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["stone_blockers"],
    difficulty: 'beginner'
  },
  {
    id: 17,
    name: "Gem Rush",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 40, description: "Collect 40 Ruby gems", gemType: "ruby" },
      { type: 'collect', target: 40, description: "Collect 40 Sapphire gems", gemType: "sapphire" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'beginner'
  },
  {
    id: 18,
    name: "Blocked Path",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 15, description: "Clear 15 stone blockers" },
      { type: 'score', target: 2000, description: "Reach 2,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["stone_blockers"],
    difficulty: 'beginner'
  },
  {
    id: 19,
    name: "Triple Threat",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 3500, description: "Reach 3,500 points" },
      { type: 'collect', target: 25, description: "Collect 25 Emerald gems", gemType: "emerald" },
      { type: 'clear', target: 8, description: "Clear 8 stone blockers" }
    ],
    timeLimit: 75,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["stone_blockers"],
    difficulty: 'beginner'
  },
  {
    id: 20,
    name: "First Reward",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 5000, description: "Reach 5,000 points" },
      { type: 'collect', target: 50, description: "Collect 50 Topaz gems", gemType: "topaz" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["stone_blockers"],
    blockchainReward: {
      cUSD: 0.5,
      gems: 50,
      nftChance: 0
    },
    difficulty: 'beginner'
  }
];

// Continue with remaining level groups...
export const allLevels: LevelConfig[] = [
  ...tutorialLevels,
  ...beginnerLevels,
  // Additional level groups will be added in separate files
];

export const getLevelById = (id: number): LevelConfig | undefined => {
  return allLevels.find(level => level.id === id);
};

export const getLevelsByDifficulty = (difficulty: string): LevelConfig[] => {
  return allLevels.filter(level => level.difficulty === difficulty);
};

export const getTotalLevels = (): number => {
  return allLevels.length;
};
