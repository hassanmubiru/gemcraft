import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameSettings } from '../../types/game';

interface SettingsSliceState extends GameSettings {
  notifications: boolean;
  autoSave: boolean;
  language: string;
  theme: 'dark' | 'light' | 'auto';
}

const initialState: SettingsSliceState = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  difficulty: 'medium',
  theme: 'dark',
  notifications: true,
  autoSave: true,
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsSliceState>>) => {
      return { ...state, ...action.payload };
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleMusic: (state) => {
      state.musicEnabled = !state.musicEnabled;
    },
    toggleHaptics: (state) => {
      state.hapticsEnabled = !state.hapticsEnabled;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setDifficulty: (state, action: PayloadAction<'easy' | 'medium' | 'hard'>) => {
      state.difficulty = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light' | 'auto'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    resetSettings: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  updateSettings,
  toggleSound,
  toggleMusic,
  toggleHaptics,
  toggleNotifications,
  setDifficulty,
  setTheme,
  setLanguage,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
