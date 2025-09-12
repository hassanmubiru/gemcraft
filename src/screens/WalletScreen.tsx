import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useWallet } from '../utils/WalletContext';
import { useGame } from '../game/GameContext';

export default function WalletScreen() {
  const { connection, isConnecting, error, connectWallet, disconnectWallet, getBalance } = useWallet();
  const { gameState } = useGame();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (connection) {
      await getBalance();
    }
    setRefreshing(false);
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      Alert.alert('Connection Error', 'Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: disconnectWallet },
      ]
    );
  };

  const handleClaimReward = () => {
    Alert.alert(
      'Claim Rewards',
      'This feature will be available after connecting to the blockchain.',
      [{ text: 'OK' }]
    );
  };

  const handleViewNFTs = () => {
    Alert.alert(
      'NFT Collection',
      'Your NFT gems will appear here after earning them in-game.',
      [{ text: 'OK' }]
    );
  };

  if (!connection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <Text style={styles.subtitle}>Connect your wallet to earn rewards</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.walletCard}>
            <Text style={styles.walletIcon}>💰</Text>
            <Text style={styles.walletTitle}>No Wallet Connected</Text>
            <Text style={styles.walletDescription}>
              Connect your wallet to start earning CELO and cUSD rewards for playing GemCraft!
            </Text>
            
            <TouchableOpacity
              style={[styles.connectButton, isConnecting && styles.disabledButton]}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              <Text style={styles.connectButtonText}>
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Text>
            </TouchableOpacity>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Blockchain Features</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureText}>Earn tokens for completing levels</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🏆</Text>
                <Text style={styles.featureText}>Collect rare NFT gems</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text style={styles.featureText}>Compete on global leaderboards</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎁</Text>
                <Text style={styles.featureText}>Daily bonus rewards</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Wallet Info */}
        <View style={styles.walletInfoCard}>
          <Text style={styles.walletAddress}>
            {connection.address.slice(0, 6)}...{connection.address.slice(-4)}
          </Text>
          <Text style={styles.networkText}>Celo Alfajores Testnet</Text>
        </View>

        {/* Balances */}
        <View style={styles.balancesCard}>
          <Text style={styles.cardTitle}>Balances</Text>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>CELO</Text>
            <Text style={styles.balanceValue}>{connection.balance.CELO}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>cUSD</Text>
            <Text style={styles.balanceValue}>{connection.balance.cUSD}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>cEUR</Text>
            <Text style={styles.balanceValue}>{connection.balance.cEUR}</Text>
          </View>
        </View>

        {/* Game Stats */}
        {gameState && (
          <View style={styles.gameStatsCard}>
            <Text style={styles.cardTitle}>Game Statistics</Text>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current Score</Text>
              <Text style={styles.statValue}>{gameState.score.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current Level</Text>
              <Text style={styles.statValue}>{gameState.level}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Combos</Text>
              <Text style={styles.statValue}>{gameState.combos}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleClaimReward}>
            <Text style={styles.actionButtonText}>🎁 Claim Rewards</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleViewNFTs}>
            <Text style={styles.actionButtonText}>💎 View NFT Collection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
            <Text style={styles.actionButtonText}>🔄 Refresh Balance</Text>
          </TouchableOpacity>
        </View>

        {/* Rewards Info */}
        <View style={styles.rewardsInfoCard}>
          <Text style={styles.cardTitle}>Reward System</Text>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>🎯</Text>
            <Text style={styles.rewardText}>Level Complete: 0.5 cUSD</Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>🎁</Text>
            <Text style={styles.rewardText}>Daily Bonus: 1 cUSD</Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>🏆</Text>
            <Text style={styles.rewardText}>Achievement: 2 cUSD</Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>💥</Text>
            <Text style={styles.rewardText}>Combo Bonus: 0.1 cUSD per combo</Text>
          </View>
        </View>

        {/* Network Info */}
        <View style={styles.networkInfoCard}>
          <Text style={styles.cardTitle}>Network Information</Text>
          <Text style={styles.networkInfoText}>
            You're connected to Celo Alfajores testnet. This is a testing environment where you can earn test tokens and NFTs.
          </Text>
          <Text style={styles.networkInfoText}>
            Get test tokens from the faucet: https://faucet.celo.org/
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 5,
  },
  disconnectButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  walletCard: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  walletTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  walletDescription: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF5722',
    fontSize: 14,
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    color: '#a0a0a0',
    fontSize: 16,
    flex: 1,
  },
  walletInfoCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  walletAddress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  networkText: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  balancesCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
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
  gameStatsCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardsInfoCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rewardIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  rewardText: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  networkInfoCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  networkInfoText: {
    color: '#a0a0a0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});
