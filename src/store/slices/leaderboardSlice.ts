import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardData, LeaderboardEntry } from '../../types/blockchain';

interface LeaderboardSliceState {
  globalLeaderboard: LeaderboardData | null;
  friendsLeaderboard: LeaderboardData | null;
  isLoading: boolean;
  lastUpdated: Date | null;
  userRank: number | null;
}

const initialState: LeaderboardSliceState = {
  globalLeaderboard: null,
  friendsLeaderboard: null,
  isLoading: false,
  lastUpdated: null,
  userRank: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGlobalLeaderboard: (state, action: PayloadAction<LeaderboardData>) => {
      state.globalLeaderboard = action.payload;
      state.lastUpdated = new Date();
    },
    setFriendsLeaderboard: (state, action: PayloadAction<LeaderboardData>) => {
      state.friendsLeaderboard = action.payload;
    },
    addEntry: (state, action: PayloadAction<LeaderboardEntry>) => {
      const entry = action.payload;
      
      if (state.globalLeaderboard) {
        // Insert entry in correct position
        const entries = state.globalLeaderboard.entries;
        const insertIndex = entries.findIndex(e => e.score < entry.score);
        
        if (insertIndex === -1) {
          entries.push(entry);
        } else {
          entries.splice(insertIndex, 0, entry);
        }
        
        // Update ranks
        entries.forEach((e, index) => {
          e.rank = index + 1;
        });
        
        state.globalLeaderboard.totalPlayers = entries.length;
      }
    },
    updateUserRank: (state, action: PayloadAction<number>) => {
      state.userRank = action.payload;
    },
    clearLeaderboard: (state) => {
      state.globalLeaderboard = null;
      state.friendsLeaderboard = null;
      state.userRank = null;
      state.lastUpdated = null;
    },
  },
});

export const {
  setLoading,
  setGlobalLeaderboard,
  setFriendsLeaderboard,
  addEntry,
  updateUserRank,
  clearLeaderboard,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
