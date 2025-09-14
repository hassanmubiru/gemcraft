// Levels 41-70: Advanced Mechanics & Hard Challenges
import { LevelConfig } from './levelRoadmap';

export const advancedMechanicsLevels: LevelConfig[] = [
  // Levels 41-50: Advanced Mechanics
  {
    id: 41,
    name: "Portal Introduction",
    gridSize: { width: 9, height: 9 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 8000, description: "Reach 8,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["portals"],
    difficulty: 'advanced'
  },
  {
    id: 42,
    name: "Bigger Grid",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 10000, description: "Reach 10,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: [],
    difficulty: 'advanced'
  },
  {
    id: 43,
    name: "Multi-Layer Blockers",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 15, description: "Clear 15 multi-layer blockers" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["multi_layer_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 44,
    name: "Portal + Blockers",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 12, description: "Clear 12 multi-layer blockers" },
      { type: 'score', target: 8000, description: "Reach 8,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["portals", "multi_layer_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 45,
    name: "Timed Cascade",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 8, description: "Create 8 cascading combos" }
    ],
    timeLimit: 60,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["multi_layer_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 46,
    name: "Portal Master",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 5, description: "Bring 5 special items through portals" },
      { type: 'score', target: 12000, description: "Reach 12,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb"],
    obstacles: ["portals", "multi_layer_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 47,
    name: "Rare NFT Gem",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 6, description: "Create 6 color bombs" },
      { type: 'collect', target: 60, description: "Collect 60 Emerald gems", gemType: "emerald" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["portals", "multi_layer_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 48,
    name: "Ultimate Portal",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 15000, description: "Reach 15,000 points" },
      { type: 'clear', target: 20, description: "Clear 20 multi-layer blockers" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["portals", "multi_layer_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 49,
    name: "Cascade Challenge",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 10, description: "Create 10 cascading combos" },
      { type: 'score', target: 18000, description: "Reach 18,000 points" }
    ],
    timeLimit: 75,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["multi_layer_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 50,
    name: "Advanced Master",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 20000, description: "Reach 20,000 points" },
      { type: 'collect', target: 80, description: "Collect 80 Topaz gems", gemType: "topaz" },
      { type: 'special', target: 4, description: "Bring 4 special items through portals" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["portals", "multi_layer_blockers"],
    blockchainReward: {
      cUSD: 2.0,
      gems: 300,
      nftChance: 0.15,
      specialReward: "Rare NFT drop chance"
    },
    difficulty: 'advanced'
  }
];

export const comboMasteryLevels: LevelConfig[] = [
  // Levels 51-60: Combo Mastery
  {
    id: 51,
    name: "Blockers + Collection",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 25, description: "Clear 25 rows of blockers" },
      { type: 'collect', target: 50, description: "Collect 50 Ruby gems", gemType: "ruby" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 52,
    name: "Triple Special",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 3, description: "Bring 3+ special items down" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 53,
    name: "Score Speed",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 12000, description: "Reach 12,000 points" }
    ],
    timeLimit: 45,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 54,
    name: "Chain Reactions",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 12, description: "Create 12 chain reactions" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 55,
    name: "NFT Gem Drop",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 15000, description: "Reach 15,000 points" },
      { type: 'collect', target: 60, description: "Collect 60 Sapphire gems", gemType: "sapphire" },
      { type: 'combo', target: 8, description: "Create 8 chain reactions" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    blockchainReward: {
      cUSD: 0,
      gems: 250,
      nftChance: 0.2
    },
    difficulty: 'advanced'
  },
  {
    id: 56,
    name: "Multi-Objective Master",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 20, description: "Clear 20 rows of blockers" },
      { type: 'special', target: 4, description: "Bring 4+ special items down" },
      { type: 'score', target: 10000, description: "Reach 10,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 57,
    name: "Speed + Chain",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 15, description: "Create 15 chain reactions" },
      { type: 'score', target: 18000, description: "Reach 18,000 points" }
    ],
    timeLimit: 60,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 58,
    name: "Collection Rush",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 40, description: "Collect 40 Emerald gems", gemType: "emerald" },
      { type: 'collect', target: 40, description: "Collect 40 Diamond gems", gemType: "diamond" },
      { type: 'collect', target: 40, description: "Collect 40 Topaz gems", gemType: "topaz" }
    ],
    timeLimit: 75,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 59,
    name: "Ultimate Combo",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 20, description: "Create 20 chain reactions" },
      { type: 'score', target: 25000, description: "Reach 25,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  },
  {
    id: 60,
    name: "Combo Master",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 30000, description: "Reach 30,000 points" },
      { type: 'collect', target: 100, description: "Collect 100 Ruby gems", gemType: "ruby" },
      { type: 'combo', target: 25, description: "Create 25 chain reactions" },
      { type: 'special', target: 5, description: "Bring 5+ special items down" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["row_blockers"],
    difficulty: 'advanced'
  }
];

export const hardChallengeLevels: LevelConfig[] = [
  // Levels 61-70: Hard Challenges
  {
    id: 61,
    name: "Multi-Objective Hell",
    gridSize: { width: 10, height: 10 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 20000, description: "Reach 20,000 points" },
      { type: 'collect', target: 50, description: "Collect 50 Sapphire gems", gemType: "sapphire" },
      { type: 'clear', target: 15, description: "Clear 15 multi-layer blockers" },
      { type: 'special', target: 3, description: "Bring 3 special items down" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["multi_layer_blockers", "row_blockers"],
    difficulty: 'expert'
  },
  {
    id: 62,
    name: "Fog Tiles",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 15000, description: "Reach 15,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles"],
    difficulty: 'expert'
  },
  {
    id: 63,
    name: "Bigger + Fog",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 60, description: "Collect 60 Emerald gems", gemType: "emerald" },
      { type: 'clear', target: 20, description: "Clear 20 fog tiles" }
    ],
    timeLimit: 75,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles", "multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 64,
    name: "Fog + Portals",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 4, description: "Bring 4 special items through fog" },
      { type: 'score', target: 18000, description: "Reach 18,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles", "portals"],
    difficulty: 'expert'
  },
  {
    id: 65,
    name: "Ultimate Fog",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 25000, description: "Reach 25,000 points" },
      { type: 'clear', target: 30, description: "Clear 30 fog tiles" },
      { type: 'combo', target: 10, description: "Create 10 chain reactions" }
    ],
    timeLimit: 100,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "limited_visibility", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles", "multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 66,
    name: "All Obstacles",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'clear', target: 15, description: "Clear 15 fog tiles" },
      { type: 'clear', target: 15, description: "Clear 15 multi-layer blockers" },
      { type: 'clear', target: 10, description: "Clear 10 row blockers" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles", "multi_layer_blockers", "row_blockers"],
    difficulty: 'expert'
  },
  {
    id: 67,
    name: "Collection in Fog",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 80, description: "Collect 80 Diamond gems", gemType: "diamond" },
      { type: 'collect', target: 80, description: "Collect 80 Topaz gems", gemType: "topaz" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles"],
    difficulty: 'expert'
  },
  {
    id: 68,
    name: "Speed + Fog",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 20000, description: "Reach 20,000 points" }
    ],
    timeLimit: 50,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles", "multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 69,
    name: "Master Challenge",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 30000, description: "Reach 30,000 points" },
      { type: 'collect', target: 70, description: "Collect 70 Ruby gems", gemType: "ruby" },
      { type: 'clear', target: 25, description: "Clear 25 fog tiles" },
      { type: 'combo', target: 15, description: "Create 15 chain reactions" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "limited_visibility", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles", "multi_layer_blockers", "row_blockers"],
    difficulty: 'expert'
  },
  {
    id: 70,
    name: "Boss Level - Hard Master",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 40000, description: "Reach 40,000 points" },
      { type: 'collect', target: 100, description: "Collect 100 Sapphire gems", gemType: "sapphire" },
      { type: 'special', target: 6, description: "Bring 6 special items down" },
      { type: 'combo', target: 20, description: "Create 20 chain reactions" },
      { type: 'clear', target: 40, description: "Clear 40 fog tiles" }
    ],
    timeLimit: 150,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "limited_visibility", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles", "multi_layer_blockers", "row_blockers"],
    blockchainReward: {
      cUSD: 3.0,
      gems: 500,
      nftChance: 0
    },
    difficulty: 'expert'
  }
];
