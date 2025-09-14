// Level Selection Screen with 100-level roadmap integration
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
} from 'react-native';
import { allLevels, getLevelsByDifficulty } from '../data/levelRoadmap';
import { getDailyLoginBonus } from '../data/engagementFeatures';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LevelSelectScreenProps {
  navigation: any;
}

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ navigation }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('tutorial');
  const [unlockedLevels, setUnlockedLevels] = useState<Set<number>>(new Set([1]));
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [dailyBonus, setDailyBonus] = useState<any>(null);

  const difficulties = [
    { key: 'tutorial', label: 'Tutorial', color: '#2ECC71', levels: 10 },
    { key: 'beginner', label: 'Beginner', color: '#F39C12', levels: 10 },
    { key: 'intermediate', label: 'Intermediate', color: '#E67E22', levels: 20 },
    { key: 'advanced', label: 'Advanced', color: '#E74C3C', levels: 20 },
    { key: 'expert', label: 'Expert', color: '#8E44AD', levels: 20 },
    { key: 'master', label: 'Master', color: '#C0392B', levels: 20 },
  ];

  useEffect(() => {
    // Load player progress
    loadPlayerProgress();
    
    // Check daily login bonus
    checkDailyBonus();
  }, []);

  const loadPlayerProgress = () => {
    // In a real app, this would load from storage/blockchain
    // For now, we'll simulate some progress
    const mockUnlocked = new Set([1, 2, 3, 4, 5, 11, 12, 13, 21, 22]);
    const mockCompleted = new Set([1, 2, 3, 11, 12, 21]);
    
    setUnlockedLevels(mockUnlocked);
    setCompletedLevels(mockCompleted);
  };

  const checkDailyBonus = () => {
    // Check if player is eligible for daily bonus
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      const day = parseInt(localStorage.getItem('loginStreak') || '1');
      const bonus = getDailyLoginBonus(day);
      setDailyBonus(bonus);
      
      // Update login streak
      localStorage.setItem('lastLogin', today);
      localStorage.setItem('loginStreak', (day + 1).toString());
    }
  };

  const claimDailyBonus = () => {
    if (dailyBonus) {
      Alert.alert(
        'Daily Bonus Claimed!',
        `You received:\n• ${dailyBonus.reward.cUSD} cUSD\n• ${dailyBonus.reward.gems} gems\n• ${(dailyBonus.reward.nftChance * 100).toFixed(1)}% NFT chance`,
        [{ text: 'Awesome!', onPress: () => setDailyBonus(null) }]
      );
    }
  };

  const handleLevelPress = (level: any) => {
    if (!unlockedLevels.has(level.id)) {
      Alert.alert(
        'Level Locked',
        'Complete the previous levels to unlock this one.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigate to game screen
    navigation.navigate('PhaserGame', { level });
  };

  const getLevelStatus = (level: any) => {
    if (completedLevels.has(level.id)) {
      return 'completed';
    } else if (unlockedLevels.has(level.id)) {
      return 'unlocked';
    } else {
      return 'locked';
    }
  };

  const getLevelIcon = (level: any) => {
    const status = getLevelStatus(level);
    
    switch (status) {
      case 'completed':
        return '✅';
      case 'unlocked':
        return '🎮';
      case 'locked':
        return '🔒';
      default:
        return '❓';
    }
  };

  const getLevelColor = (level: any) => {
    const status = getLevelStatus(level);
    
    switch (status) {
      case 'completed':
        return '#2ECC71';
      case 'unlocked':
        return '#3498DB';
      case 'locked':
        return '#7F8C8D';
      default:
        return '#95A5A6';
    }
  };

  const renderLevel = (level: any) => {
    const status = getLevelStatus(level);
    const isLocked = status === 'locked';
    
    return (
      <TouchableOpacity
        key={level.id}
        style={[
          styles.levelButton,
          { backgroundColor: getLevelColor(level) },
          isLocked && styles.lockedLevel
        ]}
        onPress={() => handleLevelPress(level)}
        disabled={isLocked}
      >
        <Text style={styles.levelIcon}>{getLevelIcon(level)}</Text>
        <Text style={styles.levelNumber}>{level.id}</Text>
        <Text style={styles.levelName} numberOfLines={2}>
          {level.name}
        </Text>
        
        {level.blockchainReward && (
          <View style={styles.rewardIndicator}>
            <Text style={styles.rewardText}>
              {level.blockchainReward.cUSD > 0 && `💰 ${level.blockchainReward.cUSD}cUSD`}
              {level.blockchainReward.nftChance > 0 && ` 🎨 NFT`}
            </Text>
          </View>
        )}
        
        {status === 'completed' && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>COMPLETED</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDifficultySection = (difficulty: any) => {
    const levels = getLevelsByDifficulty(difficulty.key);
    const completedCount = levels.filter(level => completedLevels.has(level.id)).length;
    const progress = (completedCount / levels.length) * 100;
    
    return (
      <View key={difficulty.key} style={styles.difficultySection}>
        <View style={styles.difficultyHeader}>
          <View style={styles.difficultyInfo}>
            <Text style={[styles.difficultyTitle, { color: difficulty.color }]}>
              {difficulty.label}
            </Text>
            <Text style={styles.difficultySubtitle}>
              Levels {levels[0]?.id}-{levels[levels.length - 1]?.id} • {completedCount}/{levels.length} completed
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progress}%`,
                    backgroundColor: difficulty.color 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>
        
        <View style={styles.levelsGrid}>
          {levels.map(renderLevel)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Level Selection</Text>
          <Text style={styles.headerSubtitle}>
            {completedLevels.size}/{allLevels.length} levels completed
          </Text>
        </View>
        
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Bonus */}
      {dailyBonus && (
        <View style={styles.dailyBonusContainer}>
          <View style={styles.dailyBonusContent}>
            <Text style={styles.dailyBonusTitle}>Daily Login Bonus!</Text>
            <Text style={styles.dailyBonusText}>{dailyBonus.description}</Text>
            <TouchableOpacity style={styles.claimButton} onPress={claimDailyBonus}>
              <Text style={styles.claimButtonText}>Claim Bonus</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Difficulty Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.difficultyTabs}
        contentContainerStyle={styles.difficultyTabsContent}
      >
        {difficulties.map(difficulty => (
          <TouchableOpacity
            key={difficulty.key}
            style={[
              styles.difficultyTab,
              selectedDifficulty === difficulty.key && styles.activeDifficultyTab,
              { borderColor: difficulty.color }
            ]}
            onPress={() => setSelectedDifficulty(difficulty.key)}
          >
            <Text style={[
              styles.difficultyTabText,
              selectedDifficulty === difficulty.key && { color: difficulty.color }
            ]}>
              {difficulty.label}
            </Text>
            <Text style={styles.difficultyTabCount}>{difficulty.levels}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Levels List */}
      <ScrollView style={styles.levelsContainer} showsVerticalScrollIndicator={false}>
        {renderDifficultySection(difficulties.find(d => d.key === selectedDifficulty)!)}
      </ScrollView>

      {/* Bottom Stats */}
      <View style={styles.bottomStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedLevels.size}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{unlockedLevels.size}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{allLevels.length - unlockedLevels.size}</Text>
          <Text style={styles.statLabel}>Locked</Text>
        </View>
      </View>
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
  settingsButton: {
    padding: 8,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  dailyBonusContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  dailyBonusContent: {
    padding: 15,
    alignItems: 'center',
  },
  dailyBonusTitle: {
    color: '#2ECC71',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dailyBonusText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  claimButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  difficultyTabs: {
    marginBottom: 15,
  },
  difficultyTabsContent: {
    paddingHorizontal: 20,
  },
  difficultyTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeDifficultyTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  difficultyTabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  difficultyTabCount: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  levelsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  difficultySection: {
    marginBottom: 20,
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficultySubtitle: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  levelButton: {
    width: (screenWidth - 60) / 3,
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockedLevel: {
    opacity: 0.5,
  },
  levelIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  levelNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  levelName: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  rewardIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    padding: 2,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 8,
    fontWeight: 'bold',
  },
  completedBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    borderRadius: 4,
    padding: 2,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 2,
  },
});

export default LevelSelectScreen;