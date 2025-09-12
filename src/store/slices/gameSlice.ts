import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LevelConfig, PlayerStats, Achievement } from '../../types/game';

interface GameSliceState {
  currentLevel: number;
  unlockedLevels: number[];
  playerStats: PlayerStats;
  achievements: Achievement[];
  isPlaying: boolean;
  lastPlayedLevel: number | null;
}

const initialState: GameSliceState = {
  currentLevel: 1,
  unlockedLevels: [1],
  playerStats: {
    totalScore: 0,
    levelsCompleted: 0,
    totalMatches: 0,
    totalCombos: 0,
    playTime: 0,
    achievements: [],
  },
  achievements: [],
  isPlaying: false,
  lastPlayedLevel: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    unlockLevel: (state, action: PayloadAction<number>) => {
      if (!state.unlockedLevels.includes(action.payload)) {
        state.unlockedLevels.push(action.payload);
      }
    },
    completeLevel: (state, action: PayloadAction<{ level: number; score: number; stars: number }>) => {
      const { level, score, stars } = action.payload;
      
      // Update player stats
      state.playerStats.totalScore += score;
      state.playerStats.levelsCompleted += 1;
      
      // Unlock next level
      if (!state.unlockedLevels.includes(level + 1)) {
        state.unlockedLevels.push(level + 1);
      }
      
      // Update current level
      if (level >= state.currentLevel) {
        state.currentLevel = level + 1;
      }
    },
    updatePlayerStats: (state, action: PayloadAction<Partial<PlayerStats>>) => {
      state.playerStats = { ...state.playerStats, ...action.payload };
    },
    unlockAchievement: (state, action: PayloadAction<Achievement>) => {
      const achievement = action.payload;
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      
      if (!state.achievements.find(a => a.id === achievement.id)) {
        state.achievements.push(achievement);
      }
      
      state.playerStats.achievements.push(achievement);
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setLastPlayedLevel: (state, action: PayloadAction<number>) => {
      state.lastPlayedLevel = action.payload;
    },
    resetGameProgress: (state) => {
      state.currentLevel = 1;
      state.unlockedLevels = [1];
      state.playerStats = {
        totalScore: 0,
        levelsCompleted: 0,
        totalMatches: 0,
        totalCombos: 0,
        playTime: 0,
        achievements: [],
      };
      state.achievements = [];
      state.isPlaying = false;
      state.lastPlayedLevel = null;
    },
  },
});

export const {
  unlockLevel,
  completeLevel,
  updatePlayerStats,
  unlockAchievement,
  setPlaying,
  setLastPlayedLevel,
  resetGameProgress,
} = gameSlice.actions;

export default gameSlice.reducer;
