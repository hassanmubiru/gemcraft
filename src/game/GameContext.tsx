import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameEngine } from './GameEngine';
import { GameState, LevelConfig, Gem, GameSettings } from '../types/game';

interface GameContextType {
  gameEngine: GameEngine | null;
  gameState: GameState | null;
  settings: GameSettings;
  initializeGame: (level: LevelConfig) => void;
  selectGem: (x: number, y: number) => boolean;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameState {
  gameEngine: GameEngine | null;
  gameState: GameState | null;
  settings: GameSettings;
}

type GameAction =
  | { type: 'INITIALIZE_GAME'; payload: { level: LevelConfig } }
  | { type: 'UPDATE_GAME_STATE'; payload: GameState }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> };

const initialState: GameState = {
  gameEngine: null,
  gameState: null,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    hapticsEnabled: true,
    difficulty: 'medium',
    theme: 'dark',
  },
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      const gameEngine = new GameEngine(8, 8, action.payload.level);
      return {
        ...state,
        gameEngine,
        gameState: gameEngine.getGameState(),
      };
    
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        gameState: action.payload,
      };
    
    case 'PAUSE_GAME':
      if (state.gameState) {
        return {
          ...state,
          gameState: { ...state.gameState, isPaused: true },
        };
      }
      return state;
    
    case 'RESUME_GAME':
      if (state.gameState) {
        return {
          ...state,
          gameState: { ...state.gameState, isPaused: false },
        };
      }
      return state;
    
    case 'RESET_GAME':
      return {
        ...state,
        gameEngine: null,
        gameState: null,
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    default:
      return state;
  }
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const initializeGame = (level: LevelConfig) => {
    dispatch({ type: 'INITIALIZE_GAME', payload: { level } });
  };

  const selectGem = (x: number, y: number): boolean => {
    if (!state.gameEngine) return false;
    
    const success = state.gameEngine.selectGem(x, y);
    if (success) {
      dispatch({ type: 'UPDATE_GAME_STATE', payload: state.gameEngine.getGameState() });
    }
    return success;
  };

  const pauseGame = () => {
    dispatch({ type: 'PAUSE_GAME' });
  };

  const resumeGame = () => {
    dispatch({ type: 'RESUME_GAME' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const value: GameContextType = {
    gameEngine: state.gameEngine,
    gameState: state.gameState,
    settings: state.settings,
    initializeGame,
    selectGem,
    pauseGame,
    resumeGame,
    resetGame,
    updateSettings,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
