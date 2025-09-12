import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types/navigation';
import { useGame } from '../game/GameContext';
import { useWallet } from '../utils/WalletContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { gameState } = useGame();
  const { connection } = useWallet();

  const handlePlay = () => {
    navigation.navigate('LevelSelect');
  };

  const handleWallet = () => {
    navigation.navigate('Wallet');
  };

  const handleLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GemCraft</Text>
          <Text style={styles.subtitle}>Match-3 Puzzle on Celo</Text>
          
          {connection && (
            <View style={styles.walletInfo}>
              <Text style={styles.walletText}>
                Connected: {connection.address.slice(0, 6)}...{connection.address.slice(-4)}
              </Text>
              <Text style={styles.balanceText}>
                Balance: {connection.balance.CELO} CELO
              </Text>
            </View>
          )}
        </View>

        {/* Game Stats */}
        {gameState && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gameState.score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gameState.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gameState.combos}</Text>
              <Text style={styles.statLabel}>Combos</Text>
            </View>
          </View>
        )}

        {/* Main Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={handlePlay}>
            <Text style={styles.menuButtonText}>🎮 Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleWallet}>
            <Text style={styles.menuButtonText}>💰 Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleLeaderboard}>
            <Text style={styles.menuButtonText}>🏆 Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleSettings}>
            <Text style={styles.menuButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✨ Match-3 Gameplay</Text>
            <Text style={styles.featureItem}>🎯 Power-ups & Combos</Text>
            <Text style={styles.featureItem}>🏆 Blockchain Rewards</Text>
            <Text style={styles.featureItem}>🎨 NFT Gems</Text>
            <Text style={styles.featureItem}>📱 Cross-Platform</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built on Celo Alfajores Testnet
          </Text>
          <Text style={styles.footerText}>
            Version 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 20,
  },
  walletInfo: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  walletText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  balanceText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 5,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  featuresContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresList: {
    alignItems: 'center',
  },
  featureItem: {
    color: '#a0a0a0',
    fontSize: 14,
    marginVertical: 3,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});
