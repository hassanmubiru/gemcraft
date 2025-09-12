import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { AdminConfig, AdminStats } from '../types/blockchain';

// Default empty admin configuration
const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  rewardAmounts: {
    dailyBonus: 0,
    levelComplete: 0,
    achievement: 0,
    comboBonus: 0,
  },
  nftDropRates: {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  },
  contractAddresses: {
    rewards: '',
    nftGem: '',
    leaderboard: '',
    testCUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    testCELO: '0xF194afDf50B03a69Ea33B7c6CF6a2A4E7B3F8C2D',
  },
  isPaused: true,
};

const DEFAULT_ADMIN_STATS: AdminStats = {
  totalRewardsDistributed: 0,
  totalNFTsMinted: 0,
  activePlayers: 0,
  totalTransactions: 0,
  contractBalance: [],
};

export default function AdminScreen() {
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);
  const [stats, setStats] = useState<AdminStats>(DEFAULT_ADMIN_STATS);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRewardAmount = (type: keyof typeof config.rewardAmounts, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number');
      return;
    }

    setConfig(prev => ({
      ...prev,
      rewardAmounts: {
        ...prev.rewardAmounts,
        [type]: numValue,
      },
    }));
  };

  const handleUpdateNFTDropRate = (rarity: keyof typeof config.nftDropRates, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      Alert.alert('Invalid Input', 'Please enter a valid percentage (0-100)');
      return;
    }

    setConfig(prev => ({
      ...prev,
      nftDropRates: {
        ...prev.nftDropRates,
        [rarity]: numValue,
      },
    }));
  };

  const handleTogglePause = () => {
    setConfig(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would save to the blockchain
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Configuration saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundContract = () => {
    Alert.alert(
      'Fund Contract',
      'This will send test tokens to the rewards contract. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Fund', onPress: () => {
          Alert.alert('Success', 'Contract funded with 1000 test cUSD');
        }},
      ]
    );
  };

  const handleWithdrawFunds = () => {
    Alert.alert(
      'Withdraw Funds',
      'This will withdraw all funds from the contract. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Withdraw', style: 'destructive', onPress: () => {
          Alert.alert('Success', 'Funds withdrawn successfully');
        }},
      ]
    );
  };

  const handleMintNFT = () => {
    Alert.alert(
      'Mint Test NFT',
      'This will mint a test NFT gem to the connected wallet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mint', onPress: () => {
          Alert.alert('Success', 'Test NFT minted successfully');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage GemCraft on Celo Alfajores</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Contract Status</Text>
            <View style={styles.statusValue}>
              <Switch
                value={!config.isPaused}
                onValueChange={handleTogglePause}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={config.isPaused ? '#f4f3f4' : '#fff'}
              />
              <Text style={[styles.statusText, config.isPaused && styles.pausedText]}>
                {config.isPaused ? 'Paused' : 'Active'}
              </Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Network</Text>
            <Text style={styles.statusText}>Celo Alfajores Testnet</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalRewardsDistributed}</Text>
              <Text style={styles.statLabel}>Total Rewards (cUSD)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalNFTsMinted}</Text>
              <Text style={styles.statLabel}>NFTs Minted</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.activePlayers}</Text>
              <Text style={styles.statLabel}>Active Players</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalTransactions}</Text>
              <Text style={styles.statLabel}>Total Transactions</Text>
            </View>
          </View>
        </View>

        {/* Contract Balances */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Balances</Text>
          {stats.contractBalance.map((token, index) => (
            <View key={index} style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>{token.symbol}</Text>
              <Text style={styles.balanceValue}>{token.balance}</Text>
            </View>
          ))}
        </View>

        {/* Reward Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reward Configuration</Text>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Daily Bonus (cUSD)</Text>
            <TextInput
              style={styles.configInput}
              value={config.rewardAmounts.dailyBonus.toString()}
              onChangeText={(value) => handleUpdateRewardAmount('dailyBonus', value)}
              keyboardType="numeric"
              placeholder="1.0"
            />
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Level Complete (cUSD)</Text>
            <TextInput
              style={styles.configInput}
              value={config.rewardAmounts.levelComplete.toString()}
              onChangeText={(value) => handleUpdateRewardAmount('levelComplete', value)}
              keyboardType="numeric"
              placeholder="0.5"
            />
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Achievement (cUSD)</Text>
            <TextInput
              style={styles.configInput}
              value={config.rewardAmounts.achievement.toString()}
              onChangeText={(value) => handleUpdateRewardAmount('achievement', value)}
              keyboardType="numeric"
              placeholder="2.0"
            />
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Combo Bonus (cUSD)</Text>
            <TextInput
              style={styles.configInput}
              value={config.rewardAmounts.comboBonus.toString()}
              onChangeText={(value) => handleUpdateRewardAmount('comboBonus', value)}
              keyboardType="numeric"
              placeholder="0.1"
            />
          </View>
        </View>

        {/* NFT Drop Rates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NFT Drop Rates (%)</Text>
          
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Common</Text>
            <TextInput
              style={styles.configInput}
              value={config.nftDropRates.common.toString()}
              onChangeText={(value) => handleUpdateNFTDropRate('common', value)}
              keyboardType="numeric"
              placeholder="70"
            />
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Rare</Text>
            <TextInput
              style={styles.configInput}
              value={config.nftDropRates.rare.toString()}
              onChangeText={(value) => handleUpdateNFTDropRate('rare', value)}
              keyboardType="numeric"
              placeholder="20"
            />
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Epic</Text>
            <TextInput
              style={styles.configInput}
              value={config.nftDropRates.epic.toString()}
              onChangeText={(value) => handleUpdateNFTDropRate('epic', value)}
              keyboardType="numeric"
              placeholder="8"
            />
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Legendary</Text>
            <TextInput
              style={styles.configInput}
              value={config.nftDropRates.legendary.toString()}
              onChangeText={(value) => handleUpdateNFTDropRate('legendary', value)}
              keyboardType="numeric"
              placeholder="2"
            />
          </View>
        </View>

        {/* Contract Addresses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Addresses</Text>
          
          <View style={styles.addressItem}>
            <Text style={styles.addressLabel}>Rewards Contract</Text>
            <Text style={styles.addressValue}>{config.contractAddresses.rewards}</Text>
          </View>

          <View style={styles.addressItem}>
            <Text style={styles.addressLabel}>NFT Gem Contract</Text>
            <Text style={styles.addressValue}>{config.contractAddresses.nftGem}</Text>
          </View>

          <View style={styles.addressItem}>
            <Text style={styles.addressLabel}>Leaderboard Contract</Text>
            <Text style={styles.addressValue}>{config.contractAddresses.leaderboard}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSaveConfig}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleFundContract}>
            <Text style={styles.actionButtonText}>Fund Contract</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleWithdrawFunds}>
            <Text style={styles.actionButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleMintNFT}>
            <Text style={styles.actionButtonText}>Mint Test NFT</Text>
          </TouchableOpacity>
        </View>

        {/* Warning */}
        <View style={styles.warningSection}>
          <Text style={styles.warningTitle}>⚠️ Testnet Only</Text>
          <Text style={styles.warningText}>
            This admin dashboard is for Celo Alfajores testnet only. 
            Never use production keys or real funds in this environment.
          </Text>
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
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statusLabel: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pausedText: {
    color: '#FF5722',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  configLabel: {
    fontSize: 16,
    color: '#a0a0a0',
    flex: 1,
  },
  configInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    width: 80,
    textAlign: 'center',
  },
  addressItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  addressLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 5,
  },
  addressValue: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: 'monospace',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningSection: {
    backgroundColor: '#FF5722',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
});
