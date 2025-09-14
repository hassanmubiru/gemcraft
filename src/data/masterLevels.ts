// Levels 71-100: Expert Strategy & Master Levels
import { LevelConfig } from './levelRoadmap';

export const expertStrategyLevels: LevelConfig[] = [
  // Levels 71-80: Expert Strategy
  {
    id: 71,
    name: "Large Grid Portals",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 25000, description: "Reach 25,000 points" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["portals", "multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 72,
    name: "Timed Cascade Only",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 12, description: "Create 12 cascading combos only" }
    ],
    timeLimit: 60,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "cascade_only_win"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 73,
    name: "Hidden Special Gems",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 5, description: "Find and collect 5 hidden special gems" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "hidden_special_gems"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["fog_tiles"],
    difficulty: 'expert'
  },
  {
    id: 74,
    name: "Portal + Cascade",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 15, description: "Create 15 cascading combos" },
      { type: 'score', target: 30000, description: "Reach 30,000 points" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter"],
    obstacles: ["portals", "multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 75,
    name: "Legendary NFT Gem",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 35000, description: "Reach 35,000 points" },
      { type: 'special', target: 6, description: "Find 6 hidden special gems" },
      { type: 'combo', target: 18, description: "Create 18 cascading combos" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles"],
    difficulty: 'expert'
  },
  {
    id: 76,
    name: "Ultimate Portal",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 8, description: "Bring 8 special items through portals" },
      { type: 'clear', target: 30, description: "Clear 30 multi-layer blockers" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 77,
    name: "Cascade Master",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 25, description: "Create 25 cascading combos" },
      { type: 'score', target: 40000, description: "Reach 40,000 points" }
    ],
    timeLimit: 100,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "cascade_only_win"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers"],
    difficulty: 'expert'
  },
  {
    id: 78,
    name: "Hidden + Portal",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'special', target: 7, description: "Find 7 hidden special gems" },
      { type: 'special', target: 5, description: "Bring 5 special items through portals" }
    ],
    mechanics: ["basic_swap", "cascades", "score_bar", "portals", "hidden_special_gems"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "fog_tiles"],
    difficulty: 'expert'
  },
  {
    id: 79,
    name: "Expert Challenge",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 45000, description: "Reach 45,000 points" },
      { type: 'collect', target: 120, description: "Collect 120 Emerald gems", gemType: "emerald" },
      { type: 'combo', target: 20, description: "Create 20 cascading combos" },
      { type: 'special', target: 8, description: "Find 8 hidden special gems" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles"],
    difficulty: 'expert'
  },
  {
    id: 80,
    name: "Expert Master",
    gridSize: { width: 11, height: 11 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 50000, description: "Reach 50,000 points" },
      { type: 'collect', target: 150, description: "Collect 150 Diamond gems", gemType: "diamond" },
      { type: 'special', target: 10, description: "Find 10 hidden special gems" },
      { type: 'combo', target: 30, description: "Create 30 cascading combos" }
    ],
    timeLimit: 150,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "cascade_only_win"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles"],
    blockchainReward: {
      cUSD: 5.0,
      gems: 800,
      nftChance: 0
    },
    difficulty: 'expert'
  }
];

export const nearMasteryLevels: LevelConfig[] = [
  // Levels 81-90: Near Mastery
  {
    id: 81,
    name: "Extreme Moves",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 30000, description: "Reach 30,000 points" }
    ],
    moveLimit: 15,
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers"],
    difficulty: 'master'
  },
  {
    id: 82,
    name: "Multi-Boss 1",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 40000, description: "Reach 40,000 points" },
      { type: 'clear', target: 50, description: "Clear 50 multi-layer blockers" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 83,
    name: "Multi-Boss 2",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 200, description: "Collect 200 Ruby gems", gemType: "ruby" },
      { type: 'special', target: 12, description: "Find 12 hidden special gems" }
    ],
    timeLimit: 100,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["fog_tiles", "portals"],
    difficulty: 'master'
  },
  {
    id: 84,
    name: "Multi-Boss 3",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 35, description: "Create 35 chain reactions" },
      { type: 'clear', target: 60, description: "Clear 60 fog tiles" }
    ],
    timeLimit: 90,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "chain_reactions", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["fog_tiles", "multi_layer_blockers"],
    difficulty: 'master'
  },
  {
    id: 85,
    name: "Special Event - Double Rewards",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 60000, description: "Reach 60,000 points" },
      { type: 'collect', target: 150, description: "Collect 150 Sapphire gems", gemType: "sapphire" },
      { type: 'special', target: 15, description: "Find 15 hidden special gems" },
      { type: 'combo', target: 40, description: "Create 40 chain reactions" }
    ],
    timeLimit: 150,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles"],
    blockchainReward: {
      cUSD: 0,
      gems: 1000,
      nftChance: 0.3,
      specialReward: "Double rewards + leaderboard entry bonus"
    },
    difficulty: 'master'
  },
  {
    id: 86,
    name: "Ultimate Challenge",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 50000, description: "Reach 50,000 points" },
      { type: 'collect', target: 180, description: "Collect 180 Emerald gems", gemType: "emerald" },
      { type: 'clear', target: 40, description: "Clear 40 multi-layer blockers" },
      { type: 'special', target: 10, description: "Bring 10 special items through portals" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles"],
    difficulty: 'master'
  },
  {
    id: 87,
    name: "Extreme Efficiency",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 45000, description: "Reach 45,000 points" }
    ],
    moveLimit: 12,
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 88,
    name: "Master Collection",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 100, description: "Collect 100 Diamond gems", gemType: "diamond" },
      { type: 'collect', target: 100, description: "Collect 100 Topaz gems", gemType: "topaz" },
      { type: 'collect', target: 100, description: "Collect 100 Ruby gems", gemType: "ruby" }
    ],
    timeLimit: 100,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["fog_tiles"],
    difficulty: 'master'
  },
  {
    id: 89,
    name: "Ultimate Combo",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 50, description: "Create 50 chain reactions" },
      { type: 'score', target: 70000, description: "Reach 70,000 points" }
    ],
    timeLimit: 120,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 90,
    name: "Near Mastery",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 80000, description: "Reach 80,000 points" },
      { type: 'collect', target: 200, description: "Collect 200 Sapphire gems", gemType: "sapphire" },
      { type: 'special', target: 20, description: "Find 20 hidden special gems" },
      { type: 'combo', target: 45, description: "Create 45 chain reactions" },
      { type: 'clear', target: 80, description: "Clear 80 fog tiles" }
    ],
    timeLimit: 180,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "chain_reactions", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles", "row_blockers"],
    difficulty: 'master'
  }
];

export const finalMasterLevels: LevelConfig[] = [
  // Levels 91-100: Master Levels
  {
    id: 91,
    name: "All Mechanics",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 60000, description: "Reach 60,000 points" },
      { type: 'collect', target: 150, description: "Collect 150 Emerald gems", gemType: "emerald" },
      { type: 'special', target: 12, description: "Find 12 hidden special gems" },
      { type: 'combo', target: 30, description: "Create 30 chain reactions" },
      { type: 'clear', target: 50, description: "Clear 50 multi-layer blockers" }
    ],
    timeLimit: 150,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 92,
    name: "Ultra Timed",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 70000, description: "Reach 70,000 points" }
    ],
    timeLimit: 60,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 93,
    name: "Extreme Moves",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 65000, description: "Reach 65,000 points" },
      { type: 'collect', target: 180, description: "Collect 180 Diamond gems", gemType: "diamond" }
    ],
    moveLimit: 10,
    mechanics: ["basic_swap", "cascades", "score_bar"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers"],
    difficulty: 'master'
  },
  {
    id: 94,
    name: "Master Challenge",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 90000, description: "Reach 90,000 points" },
      { type: 'collect', target: 250, description: "Collect 250 Topaz gems", gemType: "topaz" },
      { type: 'special', target: 25, description: "Find 25 hidden special gems" },
      { type: 'combo', target: 60, description: "Create 60 chain reactions" }
    ],
    timeLimit: 180,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles"],
    difficulty: 'master'
  },
  {
    id: 95,
    name: "Pre-Final Boss",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 100000, description: "Reach 100,000 points" },
      { type: 'collect', target: 300, description: "Collect 300 Ruby gems", gemType: "ruby" },
      { type: 'special', target: 30, description: "Find 30 hidden special gems" },
      { type: 'combo', target: 70, description: "Create 70 chain reactions" },
      { type: 'clear', target: 100, description: "Clear 100 fog tiles" }
    ],
    timeLimit: 200,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "chain_reactions", "limited_visibility"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles", "row_blockers"],
    blockchainReward: {
      cUSD: 5.0,
      gems: 1500,
      nftChance: 0
    },
    difficulty: 'master'
  },
  {
    id: 96,
    name: "Ultimate Test",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 120000, description: "Reach 120,000 points" },
      { type: 'collect', target: 200, description: "Collect 200 Sapphire gems", gemType: "sapphire" },
      { type: 'collect', target: 200, description: "Collect 200 Emerald gems", gemType: "emerald" }
    ],
    timeLimit: 150,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 97,
    name: "Master Collection",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'collect', target: 150, description: "Collect 150 Diamond gems", gemType: "diamond" },
      { type: 'collect', target: 150, description: "Collect 150 Topaz gems", gemType: "topaz" },
      { type: 'collect', target: 150, description: "Collect 150 Ruby gems", gemType: "ruby" },
      { type: 'collect', target: 150, description: "Collect 150 Sapphire gems", gemType: "sapphire" },
      { type: 'collect', target: 150, description: "Collect 150 Emerald gems", gemType: "emerald" }
    ],
    timeLimit: 180,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["fog_tiles"],
    difficulty: 'master'
  },
  {
    id: 98,
    name: "Ultimate Combo",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'combo', target: 100, description: "Create 100 chain reactions" },
      { type: 'score', target: 150000, description: "Reach 150,000 points" }
    ],
    timeLimit: 200,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["multi_layer_blockers", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 99,
    name: "Final Preparation",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 200000, description: "Reach 200,000 points" },
      { type: 'special', target: 50, description: "Find 50 hidden special gems" },
      { type: 'combo', target: 80, description: "Create 80 chain reactions" },
      { type: 'clear', target: 150, description: "Clear 150 multi-layer blockers" }
    ],
    timeLimit: 250,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "chain_reactions"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles", "row_blockers"],
    difficulty: 'master'
  },
  {
    id: 100,
    name: "Final Boss Board - The Ultimate Challenge",
    gridSize: { width: 12, height: 12 },
    gemColors: 5,
    objectives: [
      { type: 'score', target: 500000, description: "Reach 500,000 points" },
      { type: 'collect', target: 500, description: "Collect 500 Ruby gems", gemType: "ruby" },
      { type: 'collect', target: 500, description: "Collect 500 Sapphire gems", gemType: "sapphire" },
      { type: 'collect', target: 500, description: "Collect 500 Emerald gems", gemType: "emerald" },
      { type: 'collect', target: 500, description: "Collect 500 Diamond gems", gemType: "diamond" },
      { type: 'collect', target: 500, description: "Collect 500 Topaz gems", gemType: "topaz" },
      { type: 'special', target: 100, description: "Find 100 hidden special gems" },
      { type: 'combo', target: 200, description: "Create 200 chain reactions" },
      { type: 'clear', target: 300, description: "Clear 300 fog tiles" },
      { type: 'clear', target: 200, description: "Clear 200 multi-layer blockers" }
    ],
    timeLimit: 600,
    mechanics: ["basic_swap", "cascades", "score_bar", "timed_countdown", "hidden_special_gems", "chain_reactions", "limited_visibility", "portals"],
    powerUps: ["line_clear", "bomb", "color_bomb", "portal_shifter", "legendary_nft_gem", "exclusive_nft_gem"],
    obstacles: ["portals", "multi_layer_blockers", "fog_tiles", "row_blockers"],
    blockchainReward: {
      cUSD: 10.0,
      gems: 5000,
      nftChance: 1.0,
      specialReward: "Exclusive NFT + Leaderboard Crown"
    },
    difficulty: 'master'
  }
];
