import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/store';
import { GameProvider } from './src/game/GameContext';
import { WalletProvider } from './src/utils/WalletContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import WalletScreen from './src/screens/WalletScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Types
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <WalletProvider>
            <GameProvider>
              <NavigationContainer>
                <StatusBar style="light" backgroundColor="#1a1a2e" />
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#1a1a2e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    cardStyle: {
                      backgroundColor: '#16213e',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'GemCraft' }}
                  />
                  <Stack.Screen 
                    name="LevelSelect" 
                    component={LevelSelectScreen}
                    options={{ title: 'Select Level' }}
                  />
                  <Stack.Screen 
                    name="Game" 
                    component={GameScreen}
                    options={{ 
                      title: 'Playing',
                      headerShown: false 
                    }}
                  />
                  <Stack.Screen 
                    name="Wallet" 
                    component={WalletScreen}
                    options={{ title: 'Wallet' }}
                  />
                  <Stack.Screen 
                    name="Leaderboard" 
                    component={LeaderboardScreen}
                    options={{ title: 'Leaderboard' }}
                  />
                  <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen}
                    options={{ title: 'Settings' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </GameProvider>
          </WalletProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
