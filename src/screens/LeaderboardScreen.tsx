import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LeaderboardEntry } from '../types/blockchain';

// Leaderboard will be loaded from blockchain
const EMPTY_LEADERBOARD: LeaderboardEntry[] = [];

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'global' | 'friends'>('global');

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => {
    const isTopThree = entry.rank <= 3;
    
    return (
      <View
        key={entry.address}
        style={[
          styles.leaderboardEntry,
          isTopThree && styles.topThreeEntry,
        ]}
      >
        <View style={styles.rankContainer}>
          <Text style={[
            styles.rankText,
            isTopThree && styles.topThreeRankText,
          ]}>
            {renderRankIcon(entry.rank)}
          </Text>
        </View>
        
        <View style={styles.playerInfo}>
          <Text style={[
            styles.playerName,
            isTopThree && styles.topThreePlayerName,
          ]}>
            {entry.displayName || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
          </Text>
          <Text style={styles.playerAddress}>
            {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
          </Text>
        </View>
        
        <View style={styles.scoreInfo}>
          <Text style={[
            styles.scoreText,
            isTopThree && styles.topThreeScoreText,
          ]}>
            {entry.score.toLocaleString()}
          </Text>
          <Text style={styles.levelText}>
            Level {entry.level}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top players on Celo Alfajores</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'global' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('global')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'global' && styles.activeTabText,
          ]}>
            Global
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'friends' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('friends')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'friends' && styles.activeTabText,
          ]}>
            Friends
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Podium */}
        {selectedTab === 'global' && leaderboard.length >= 3 && (
          <View style={styles.podiumContainer}>
            <Text style={styles.podiumTitle}>🏆 Top 3 Players</Text>
            <View style={styles.podium}>
              {/* 2nd Place */}
              <View style={styles.podiumItem}>
                <Text style={styles.podiumRank}>2</Text>
                <Text style={styles.podiumName}>
                  {leaderboard[1].displayName || 'Player 2'}
                </Text>
                <Text style={styles.podiumScore}>
                  {leaderboard[1].score.toLocaleString()}
                </Text>
              </View>
              
              {/* 1st Place */}
              <View style={[styles.podiumItem, styles.firstPlace]}>
                <Text style={styles.podiumRank}>1</Text>
                <Text style={styles.podiumName}>
                  {leaderboard[0].displayName || 'Player 1'}
                </Text>
                <Text style={styles.podiumScore}>
                  {leaderboard[0].score.toLocaleString()}
                </Text>
              </View>
              
              {/* 3rd Place */}
              <View style={styles.podiumItem}>
                <Text style={styles.podiumRank}>3</Text>
                <Text style={styles.podiumName}>
                  {leaderboard[2].displayName || 'Player 3'}
                </Text>
                <Text style={styles.podiumScore}>
                  {leaderboard[2].score.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Leaderboard List */}
        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>
            {selectedTab === 'global' ? 'Global Rankings' : 'Friends Rankings'}
          </Text>
          
          {selectedTab === 'friends' ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>👥</Text>
              <Text style={styles.emptyStateTitle}>No Friends Yet</Text>
              <Text style={styles.emptyStateText}>
                Connect with friends to see their scores and compete together!
              </Text>
            </View>
          ) : (
            leaderboard.map((entry, index) => renderLeaderboardEntry(entry, index))
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Leaderboard Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{leaderboard.length}</Text>
              <Text style={styles.statLabel}>Total Players</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {leaderboard.length > 0 ? leaderboard[0].score.toLocaleString() : '0'}
              </Text>
              <Text style={styles.statLabel}>Highest Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {leaderboard.length > 0 ? leaderboard[0].level : '0'}
              </Text>
              <Text style={styles.statLabel}>Highest Level</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How to Climb the Leaderboard</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>🎯 Complete levels with high scores</Text>
            <Text style={styles.infoItem}>💥 Create amazing combos</Text>
            <Text style={styles.infoItem}>⚡ Use power-ups strategically</Text>
            <Text style={styles.infoItem}>🏆 Play daily for bonus rewards</Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    color: '#a0a0a0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  podiumContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  podiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  podiumItem: {
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    minWidth: 80,
  },
  firstPlace: {
    backgroundColor: '#FFD700',
    transform: [{ scale: 1.1 }],
  },
  podiumRank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  podiumName: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 5,
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  leaderboardContainer: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
    paddingBottom: 10,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  topThreeEntry: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a0a0a0',
  },
  topThreeRankText: {
    color: '#FFD700',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  topThreePlayerName: {
    color: '#4CAF50',
  },
  playerAddress: {
    fontSize: 12,
    color: '#666',
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  topThreeScoreText: {
    color: '#4CAF50',
  },
  levelText: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoList: {
    gap: 10,
  },
  infoItem: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
});
