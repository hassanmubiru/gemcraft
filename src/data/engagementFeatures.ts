// Engagement & Replay Features Configuration
import { LevelConfig } from './levelRoadmap';

export interface DailyLoginBonus {
  day: number;
  reward: {
    cUSD: number;
    gems: number;
    nftChance: number;
  };
  description: string;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  totalScore: number;
  levelsCompleted: number;
  highestLevel: number;
  nftsOwned: number;
  rank: number;
}

export interface ReplayReward {
  levelId: number;
  highScoreMultiplier: number;
  bonusReward: {
    cUSD: number;
    gems: number;
    nftChance: number;
  };
}

// Daily Login Bonus System (7-day cycle)
export const dailyLoginBonuses: DailyLoginBonus[] = [
  {
    day: 1,
    reward: { cUSD: 0.1, gems: 50, nftChance: 0.01 },
    description: "Welcome back! Here's your daily bonus."
  },
  {
    day: 2,
    reward: { cUSD: 0.15, gems: 75, nftChance: 0.02 },
    description: "Day 2 streak! Keep it up!"
  },
  {
    day: 3,
    reward: { cUSD: 0.2, gems: 100, nftChance: 0.03 },
    description: "3 days strong! You're on fire!"
  },
  {
    day: 4,
    reward: { cUSD: 0.3, gems: 150, nftChance: 0.05 },
    description: "Halfway through the week!"
  },
  {
    day: 5,
    reward: { cUSD: 0.4, gems: 200, nftChance: 0.07 },
    description: "5 days! You're unstoppable!"
  },
  {
    day: 6,
    reward: { cUSD: 0.5, gems: 250, nftChance: 0.1 },
    description: "Almost there! One more day!"
  },
  {
    day: 7,
    reward: { cUSD: 1.0, gems: 500, nftChance: 0.2 },
    description: "Perfect week! Here's your mega bonus!"
  }
];

// Replay Rewards for High Scores
export const replayRewards: ReplayReward[] = [
  // Levels 1-10: Tutorial levels
  { levelId: 1, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 2, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 3, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 4, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 5, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 6, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 7, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 8, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 9, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  { levelId: 10, highScoreMultiplier: 1.5, bonusReward: { cUSD: 0.05, gems: 25, nftChance: 0.01 } },
  
  // Levels 11-20: Beginner levels
  { levelId: 11, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 12, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 13, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 14, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 15, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 16, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 17, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 18, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 19, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  { levelId: 20, highScoreMultiplier: 2.0, bonusReward: { cUSD: 0.1, gems: 50, nftChance: 0.02 } },
  
  // Levels 21-30: Combo expansion levels
  { levelId: 21, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 22, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 23, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 24, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 25, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 26, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 27, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 28, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 29, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  { levelId: 30, highScoreMultiplier: 2.5, bonusReward: { cUSD: 0.15, gems: 75, nftChance: 0.03 } },
  
  // Levels 31-40: Intermediate strategy levels
  { levelId: 31, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 32, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 33, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 34, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 35, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 36, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 37, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 38, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 39, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  { levelId: 40, highScoreMultiplier: 3.0, bonusReward: { cUSD: 0.2, gems: 100, nftChance: 0.05 } },
  
  // Levels 41-50: Advanced mechanics levels
  { levelId: 41, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 42, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 43, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 44, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 45, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 46, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 47, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 48, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 49, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  { levelId: 50, highScoreMultiplier: 3.5, bonusReward: { cUSD: 0.25, gems: 125, nftChance: 0.07 } },
  
  // Levels 51-60: Combo mastery levels
  { levelId: 51, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 52, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 53, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 54, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 55, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 56, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 57, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 58, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 59, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  { levelId: 60, highScoreMultiplier: 4.0, bonusReward: { cUSD: 0.3, gems: 150, nftChance: 0.1 } },
  
  // Levels 61-70: Hard challenge levels
  { levelId: 61, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 62, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 63, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 64, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 65, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 66, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 67, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 68, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 69, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  { levelId: 70, highScoreMultiplier: 4.5, bonusReward: { cUSD: 0.35, gems: 175, nftChance: 0.12 } },
  
  // Levels 71-80: Expert strategy levels
  { levelId: 71, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 72, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 73, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 74, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 75, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 76, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 77, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 78, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 79, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  { levelId: 80, highScoreMultiplier: 5.0, bonusReward: { cUSD: 0.4, gems: 200, nftChance: 0.15 } },
  
  // Levels 81-90: Near mastery levels
  { levelId: 81, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 82, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 83, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 84, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 85, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 86, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 87, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 88, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 89, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  { levelId: 90, highScoreMultiplier: 5.5, bonusReward: { cUSD: 0.45, gems: 225, nftChance: 0.18 } },
  
  // Levels 91-100: Master levels
  { levelId: 91, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 92, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 93, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 94, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 95, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 96, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 97, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 98, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 99, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } },
  { levelId: 100, highScoreMultiplier: 6.0, bonusReward: { cUSD: 0.5, gems: 250, nftChance: 0.2 } }
];

// Leaderboard Configuration
export const leaderboardConfig = {
  maxEntries: 100,
  updateFrequency: 300000, // 5 minutes
  rewardTiers: [
    { rank: 1, reward: { cUSD: 10, gems: 1000, nftChance: 0.5 } },
    { rank: 2, reward: { cUSD: 5, gems: 500, nftChance: 0.3 } },
    { rank: 3, reward: { cUSD: 3, gems: 300, nftChance: 0.2 } },
    { rank: 4, reward: { cUSD: 2, gems: 200, nftChance: 0.15 } },
    { rank: 5, reward: { cUSD: 1, gems: 100, nftChance: 0.1 } },
    { rank: 10, reward: { cUSD: 0.5, gems: 50, nftChance: 0.05 } },
    { rank: 25, reward: { cUSD: 0.2, gems: 20, nftChance: 0.02 } },
    { rank: 50, reward: { cUSD: 0.1, gems: 10, nftChance: 0.01 } }
  ]
};

// Utility functions
export const getDailyLoginBonus = (day: number): DailyLoginBonus => {
  const bonusIndex = (day - 1) % 7;
  return dailyLoginBonuses[bonusIndex];
};

export const getReplayReward = (levelId: number): ReplayReward | undefined => {
  return replayRewards.find(reward => reward.levelId === levelId);
};

export const calculateHighScoreBonus = (levelId: number, currentScore: number, targetScore: number): number => {
  const replayReward = getReplayReward(levelId);
  if (!replayReward) return 1;
  
  const scoreRatio = currentScore / targetScore;
  if (scoreRatio >= replayReward.highScoreMultiplier) {
    return replayReward.highScoreMultiplier;
  }
  
  return Math.max(1, scoreRatio);
};

export const getLeaderboardReward = (rank: number): { cUSD: number; gems: number; nftChance: number } | null => {
  const tier = leaderboardConfig.rewardTiers.find(tier => rank <= tier.rank);
  return tier ? tier.reward : null;
};
