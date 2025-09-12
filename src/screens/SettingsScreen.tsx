import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useGame } from '../game/GameContext';
import { useWallet } from '../utils/WalletContext';

export default function SettingsScreen() {
  const { settings, updateSettings } = useGame();
  const { connection, disconnectWallet } = useWallet();

  const handleToggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleToggleMusic = () => {
    updateSettings({ musicEnabled: !settings.musicEnabled });
  };

  const handleToggleHaptics = () => {
    updateSettings({ hapticsEnabled: !settings.hapticsEnabled });
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    updateSettings({ difficulty });
  };

  const handleThemeChange = (theme: 'dark' | 'light') => {
    updateSettings({ theme });
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Game Progress',
      'Are you sure you want to reset all your game progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would reset the game progress
            Alert.alert('Progress Reset', 'Your game progress has been reset.');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and may improve performance.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Cache Cleared', 'Cache has been cleared successfully.');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About GemCraft',
      'GemCraft v1.0.0\n\nA modern match-3 puzzle game built on Celo blockchain.\n\nBuilt with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };

  const handleDisconnectWallet = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: disconnectWallet },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Play sound effects during gameplay</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={settings.soundEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Background Music</Text>
              <Text style={styles.settingDescription}>Play background music</Text>
            </View>
            <Switch
              value={settings.musicEnabled}
              onValueChange={handleToggleMusic}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={settings.musicEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Game Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingDescription}>Vibrate on gem matches and interactions</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={settings.hapticsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Difficulty</Text>
              <Text style={styles.settingDescription}>Adjust game difficulty</Text>
            </View>
            <View style={styles.difficultyButtons}>
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyButton,
                    settings.difficulty === difficulty && styles.activeDifficultyButton,
                  ]}
                  onPress={() => handleDifficultyChange(difficulty)}
                >
                  <Text style={[
                    styles.difficultyButtonText,
                    settings.difficulty === difficulty && styles.activeDifficultyButtonText,
                  ]}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>Choose your preferred theme</Text>
            </View>
            <View style={styles.themeButtons}>
              {(['dark', 'light'] as const).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.themeButton,
                    settings.theme === theme && styles.activeThemeButton,
                  ]}
                  onPress={() => handleThemeChange(theme)}
                >
                  <Text style={[
                    styles.themeButtonText,
                    settings.theme === theme && styles.activeThemeButtonText,
                  ]}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Wallet Settings */}
        {connection && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallet</Text>
            
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>Connected Wallet</Text>
              <Text style={styles.walletAddress}>
                {connection.address.slice(0, 6)}...{connection.address.slice(-4)}
              </Text>
              <Text style={styles.walletNetwork}>Celo Alfajores Testnet</Text>
            </View>

            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnectWallet}>
              <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleResetProgress}>
            <Text style={styles.actionButtonText}>Reset Game Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
            <Text style={styles.actionButtonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAbout}>
            <Text style={styles.actionButtonText}>About GemCraft</Text>
          </TouchableOpacity>

          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <Text style={styles.versionText}>Built on Celo Alfajores</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  activeDifficultyButton: {
    backgroundColor: '#4CAF50',
  },
  difficultyButtonText: {
    color: '#a0a0a0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeDifficultyButtonText: {
    color: '#fff',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  themeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  activeThemeButton: {
    backgroundColor: '#4CAF50',
  },
  themeButtonText: {
    color: '#a0a0a0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeThemeButtonText: {
    color: '#fff',
  },
  walletInfo: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  walletLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 5,
  },
  walletAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  walletNetwork: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  disconnectButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    color: '#a0a0a0',
    fontSize: 14,
    marginBottom: 5,
  },
});
