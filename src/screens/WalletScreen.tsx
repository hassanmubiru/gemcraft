// Comprehensive Wallet Screen for GemCraft
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { celoGameUtils, GameTransaction } from '../utils/CeloGameUtils';
import { CELO_NETWORKS } from '../utils/CeloWallet';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WalletScreenProps {
  navigation: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const { walletState, updateBalance } = useWallet();
  const [transactions, setTransactions] = useState<GameTransaction[]>([]);
  const [playerStats, setPlayerStats] = useState({
    levelsCompleted: 0,
    totalScore: 0,
    nftsOwned: 0,
    totalRewards: 0,
    rank: 0,
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'leaderboard'>('overview');

  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      loadWalletData();
    }
  }, [walletState.isConnected, walletState.address]);

  const loadWalletData = async () => {
    if (!walletState.address) return;

    try {
      // Load transactions
      const txHistory = await celoGameUtils.getTransactionHistory(walletState.address);
      setTransactions(txHistory);

      // Load player stats
      const stats = await celoGameUtils.getPlayerStats(walletState.address);
      setPlayerStats(stats);

      // Load leaderboard
      const leaderboardData = await celoGameUtils.getLeaderboard(50);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await updateBalance();
      await loadWalletData();
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.001) return '< 0.001';
    return num.toFixed(3);
  };

  const formatTransactionType = (type: string): string => {
    switch (type) {
      case 'reward': return '💰 Reward';
      case 'nft_mint': return '🎨 NFT Mint';
      case 'level_complete': return '✅ Level Complete';
      case 'daily_bonus': return '🎁 Daily Bonus';
      default: return '📄 Transaction';
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const copyToClipboard = (text: string) => {
    // In a real implementation, this would copy to clipboard
    Alert.alert('Copied!', `${text} copied to clipboard`);
  };

  const openExplorer = (hash: string) => {
    const network = walletState.network || 'alfajores';
    const explorerUrl = `${CELO_NETWORKS[network].blockExplorerUrl}/tx/${hash}`;
    // In a real implementation, this would open the URL
    Alert.alert('Explorer', `View transaction: ${explorerUrl}`);
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Wallet Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Network:</Text>
            <View style={[styles.networkBadge, { backgroundColor: walletState.network === 'alfajores' ? '#F39C12' : '#2ECC71' }]}>
              <Text style={styles.networkText}>{walletState.network?.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Address:</Text>
            <TouchableOpacity onPress={() => copyToClipboard(walletState.address || '')}>
              <Text style={styles.addressText}>{formatAddress(walletState.address || '')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Balances */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Balances</Text>
        <View style={styles.balanceGrid}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceIcon}>🟡</Text>
            <Text style={styles.balanceLabel}>CELO</Text>
            <Text style={styles.balanceValue}>{formatBalance(walletState.balance.CELO)}</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceIcon}>💵</Text>
            <Text style={styles.balanceLabel}>cUSD</Text>
            <Text style={styles.balanceValue}>{formatBalance(walletState.balance.cUSD)}</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceIcon}>💶</Text>
            <Text style={styles.balanceLabel}>cEUR</Text>
            <Text style={styles.balanceValue}>{formatBalance(walletState.balance.cEUR)}</Text>
          </View>
        </View>
      </View>

      {/* Player Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{playerStats.levelsCompleted}</Text>
            <Text style={styles.statLabel}>Levels Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{playerStats.totalScore.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{playerStats.nftsOwned}</Text>
            <Text style={styles.statLabel}>NFTs Owned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{playerStats.totalRewards}</Text>
            <Text style={styles.statLabel}>Total Rewards (cUSD)</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('LevelSelect')}>
            <Text style={styles.actionIcon}>🎮</Text>
            <Text style={styles.actionLabel}>Play Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('transactions')}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionLabel}>View Transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('leaderboard')}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionLabel}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={handleRefresh}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionLabel}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderTransactions = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📄</Text>
            <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyStateText}>
              Complete levels to start earning rewards and see your transaction history!
            </Text>
          </View>
        ) : (
          transactions.map((tx, index) => (
            <TouchableOpacity
              key={index}
              style={styles.transactionCard}
              onPress={() => openExplorer(tx.hash)}
            >
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionType}>{formatTransactionType(tx.type)}</Text>
                <Text style={styles.transactionTime}>{formatTimestamp(tx.timestamp)}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionHash}>{formatAddress(tx.hash)}</Text>
                {tx.amount && (
                  <Text style={styles.transactionAmount}>+{tx.amount} cUSD</Text>
                )}
                {tx.levelId && (
                  <Text style={styles.transactionLevel}>Level {tx.levelId}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderLeaderboard = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Global Leaderboard</Text>
        {leaderboard.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏆</Text>
            <Text style={styles.emptyStateTitle}>Leaderboard Loading</Text>
            <Text style={styles.emptyStateText}>
              The leaderboard is being updated. Check back soon!
            </Text>
          </View>
        ) : (
          leaderboard.map((player, index) => (
            <View
              key={index}
              style={[
                styles.leaderboardCard,
                player.address === walletState.address && styles.currentPlayerCard
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={[
                  styles.rankText,
                  index < 3 && styles.topRankText
                ]}>
                  #{player.rank}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerAddress}>
                  {formatAddress(player.address)}
                  {player.address === walletState.address && ' (You)'}
                </Text>
                <Text style={styles.playerScore}>{player.score.toLocaleString()} points</Text>
              </View>
              <View style={styles.playerStats}>
                <Text style={styles.playerLevels}>{player.levelsCompleted} levels</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <Text style={styles.headerSubtitle}>
            {walletState.isConnected ? 'Connected' : 'Not Connected'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Wallet Connection */}
      <WalletConnect showBalance={false} compact />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  networkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  balanceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  transactionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionTime: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionHash: {
    color: '#A0A0A0',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  transactionAmount: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionLevel: {
    color: '#3498DB',
    fontSize: 12,
  },
  leaderboardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPlayerCard: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topRankText: {
    color: '#FFD700',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerAddress: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  playerScore: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  playerStats: {
    alignItems: 'flex-end',
  },
  playerLevels: {
    color: '#3498DB',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default WalletScreen;