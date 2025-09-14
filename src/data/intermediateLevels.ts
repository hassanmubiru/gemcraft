// Levels 21-40: Combo Expansion & Intermediate Strategy
import { LevelConfig } from './levelRoadmap';

export const comboExpansionLevels: LevelConfig[] = [
  // Levels 21-30: Combo Expansion
  {
    id: 21,
    name: "Ice Breaker",
    gridSize: { width: 8, height: 8 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 12, description: "Break 12 ice tiles" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["ice_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 22,
    name: "Bigger Grid",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 4000, description: "Reach 4,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: [],
    difficulty: 'intermediate'
  },
  {
    id: 23,
    name: "Special Delivery",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 3, description: "Bring 3 special items to bottom" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["ice_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 24,
    name: "Double Blockers",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 8, description: "Clear 8 two-step blockers" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb"],
    obstacles: ["two_step_blockers"],
    difficulty: 'intermediate'
  },
  {
    id: 25,
    name: "NFT Chance",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 6000, description: "Reach 6,000 points" },
      { type: 'collect', target: 30, description: "Collect 30 Diamond gems", gemType: "diamond" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers"],
    blockchainReward: {
      cUSD: 0,
      gems: 100,
      nftChance: 0.1
    },
    difficulty: 'intermediate'
  },
  {
    id: 26,
    name: "Color Bomb Intro",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 3, description: "Create 3 color bombs" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 27,
    name: "Mixed Obstacles",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 10, description: "Clear 10 ice tiles" },
      { type: 'clear', target: 6, description: "Clear 6 two-step blockers" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers"],
    difficulty: 'intermediate'
  },
  {
    id: 28,
    name: "Special + Score",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 2, description: "Bring 2 special items to bottom" },
      { type: 'score', target: 5000, description: "Reach 5,000 points" }
    ],
    timeLimit: 75,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 29,
    name: "Combo Master",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 5, description: "Create 5 color bombs" },
      { type: 'score', target: 7000, description: "Reach 7,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers"],
    difficulty: 'intermediate'
  },
  {
    id: 30,
    name: "Expansion Complete",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 8000, description: "Reach 8,000 points" },
      { type: 'collect', target: 40, description: "Collect 40 Ruby gems", gemType: "ruby" },
      { type: 'clear', target: 15, description: "Clear 15 ice tiles" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers"],
    difficulty: 'intermediate'
  }
];

export const intermediateStrategyLevels: LevelConfig[] = [
  // Levels 31-40: Intermediate Strategy
  {
    id: 31,
    name: "Timed + Moves",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 6000, description: "Reach 6,000 points" }
    ],
    timeLimit: 60,
    moveLimit: 30,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers"],
    difficulty: 'intermediate'
  },
  {
    id: 32,
    name: "Multi-Gem Collection",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 25, description: "Collect 25 Ruby gems", gemType: "ruby" },
      { type: 'collect', target: 25, description: "Collect 25 Sapphire gems", gemType: "sapphire" },
      { type: 'collect', target: 25, description: "Collect 25 Emerald gems", gemType: "emerald" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 33,
    name: "Locked Challenge",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 12, description: "Clear 12 locked tiles requiring multiple clears" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["multi_clear_locked_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 34,
    name: "Score Rush",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 10000, description: "Reach 10,000 points" }
    ],
    timeLimit: 45,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers"],
    difficulty: 'intermediate'
  },
  {
    id: 35,
    name: "Obstacle Master",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 8, description: "Clear 8 ice tiles" },
      { type: 'clear', target: 8, description: "Clear 8 two-step blockers" },
      { type: 'clear', target: 6, description: "Clear 6 multi-clear locked tiles" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers", "multi_clear_locked_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 36,
    name: "Combo + Collection",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 4, description: "Create 4 color bombs" },
      { type: 'collect', target: 50, description: "Collect 50 Topaz gems", gemType: "topaz" }
    ],
    timeLimit: 75,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 37,
    name: "Special Delivery Plus",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 4, description: "Bring 4 special items to bottom" },
      { type: 'score', target: 8000, description: "Reach 8,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers"],
    difficulty: 'intermediate'
  },
  {
    id: 38,
    name: "Move Efficiency",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 7000, description: "Reach 7,000 points" },
      { type: 'collect', target: 30, description: "Collect 30 Diamond gems", gemType: "diamond" }
    ],
    moveLimit: 25,
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["multi_clear_locked_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 39,
    name: "Ultimate Challenge",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 12000, description: "Reach 12,000 points" },
      { type: 'collect', target: 35, description: "Collect 35 Ruby gems", gemType: "ruby" },
      { type: 'clear', target: 10, description: "Clear 10 multi-clear locked tiles" }
    ],
    timeLimit: 100,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers", "multi_clear_locked_tiles"],
    difficulty: 'intermediate'
  },
  {
    id: 40,
    name: "Boss Level - Strategy Master",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 15000, description: "Reach 15,000 points" },
      { type: 'collect', target: 50, description: "Collect 50 Sapphire gems", gemType: "sapphire" },
      { type: 'special', target: 3, description: "Bring 3 special items to bottom" },
      { type: 'combo', target: 5, description: "Create 5 color bombs" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["ice_tiles", "two_step_blockers", "multi_clear_locked_tiles"],
    blockchainReward: {
      cUSD: 1.0,
      gems: 200,
      nftChance: 0
    },
    difficulty: 'intermediate'
  }
];
