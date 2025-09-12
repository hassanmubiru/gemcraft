import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LevelConfig } from './game';

export type RootStackParamList = {
  Home: undefined;
  LevelSelect: undefined;
  Game: {
    level: LevelConfig;
  };
  Wallet: undefined;
  Leaderboard: undefined;
  Settings: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type LevelSelectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LevelSelect'>;
export type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
export type WalletScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Wallet'>;
export type LeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;
