// Updated GameScreen that integrates with Phaser game engine
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LevelConfig } from '../data/levelRoadmap';
import PhaserGameComponent from '../components/PhaserGameComponent';
import { blockchainManager } from '../utils/BlockchainManager';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GameResult {
  success: boolean;
  score: number;
  performance: {
    stars: number;
    completionRate: number;
    score: number;
    moves: number;
    timeLeft: number;
  };
  levelConfig: LevelConfig;
}

interface PhaserGameScreenProps {
  route: {
    params: {
      level: LevelConfig;
    };
  };
  navigation: any;
}

const PhaserGameScreen: React.FC<PhaserGameScreenProps> = ({ route, navigation }) => {
  const { level } = route.params;
  const [isPaused, setIsPaused] = useState(false);
  const [gameStats, setGameStats] = useState({
    score: 0,
    moves: 0,
    timeLeft: level.timeLimit || 0,
  });

  // Check if running on web platform
  const isWeb = Platform.OS === 'web';

  const handleGameEnd = useCallback(async (result: GameResult) => {
    try {
      // Calculate blockchain rewards
      const rewards = calculateRewards(result);
      
      // Show result alert
      Alert.alert(
        result.success ? 'Level Complete!' : 'Level Failed',
        `Score: ${result.score}\nStars: ${result.performance.stars}/3\nCompletion: ${Math.round(result.performance.completionRate * 100)}%`,
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to result screen with blockchain integration
              navigation.navigate('GameResult', {
                score: result.score,
                success: result.success,
                level: level,
                performance: result.performance,
                rewards: rewards,
              });
            }
          }
        ]
      );

      // Process blockchain rewards if level was successful
      if (result.success && level.blockchainReward) {
        await processBlockchainRewards(result, rewards);
      }
    } catch (error) {
      console.error('Error handling game end:', error);
      Alert.alert('Error', 'Failed to process game results. Please try again.');
    }
  }, [level, navigation]);

  const calculateRewards = (result: GameResult) => {
    const baseReward = level.blockchainReward || { cUSD: 0, gems: 0, nftChance: 0 };
    
    // Apply performance multiplier
    const performanceMultiplier = getPerformanceMultiplier(result.performance.stars);
    
    return {
      cUSD: baseReward.cUSD * performanceMultiplier,
      gems: baseReward.gems * performanceMultiplier,
      nftChance: baseReward.nftChance * performanceMultiplier,
      specialReward: baseReward.specialReward,
    };
  };

  const getPerformanceMultiplier = (stars: number): number => {
    switch (stars) {
      case 1: return 1.0;
      case 2: return 1.25;
      case 3: return 1.5;
      default: return 1.0;
    }
  };

  const processBlockchainRewards = async (result: GameResult, rewards: any) => {
    try {
      const contractInteraction = blockchainManager.getContractInteraction();
      
      if (contractInteraction) {
        // Process level completion
        await contractInteraction.completeLevel(
          level.id,
          result.score,
          result.performance.stars,
          result.performance.completionRate
        );

        // Process rewards
        if (rewards.cUSD > 0) {
          await contractInteraction.claimReward(rewards.cUSD, rewards.gems);
        }

        // Process NFT minting
        if (rewards.nftChance > 0 && Math.random() < rewards.nftChance) {
          await contractInteraction.mintNFT(level.id, result.performance.stars);
        }
      }
    } catch (error) {
      console.error('Error processing blockchain rewards:', error);
      Alert.alert(
        'Blockchain Error',
        'Failed to process rewards. Your progress has been saved locally.'
      );
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    Alert.alert(
      'Restart Level',
      'Are you sure you want to restart this level?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restart', 
          style: 'destructive',
          onPress: () => {
            // Restart logic would be handled by PhaserGameComponent
            setIsPaused(false);
          }
        }
      ]
    );
  };

  const handleQuit = () => {
    Alert.alert(
      'Quit Game',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Quit', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'tutorial': return '#2ECC71';
      case 'beginner': return '#F39C12';
      case 'intermediate': return '#E67E22';
      case 'advanced': return '#E74C3C';
      case 'expert': return '#8E44AD';
      case 'master': return '#C0392B';
      default: return '#FFFFFF';
    }
  };

  if (!isWeb) {
    // Fallback for non-web platforms
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>Phaser Game Engine</Text>
          <Text style={styles.fallbackText}>
            The advanced Phaser game engine is only available on web platforms.
          </Text>
          <Text style={styles.fallbackText}>
            Please use the web version for the full 100-level experience.
          </Text>
          <TouchableOpacity style={styles.fallbackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.fallbackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.levelName}>{level.name}</Text>
          <View style={styles.levelInfo}>
            <Text style={[styles.difficultyBadge, { color: getDifficultyColor(level.difficulty) }]}>
              {level.difficulty.toUpperCase()}
            </Text>
            <Text style={styles.levelDescription}>
              Level {level.id} • {level.gridSize.width}×{level.gridSize.height} • {level.gemColors} colors
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseButtonText}>
            {isPaused ? '▶️' : '⏸️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Level Objectives */}
      <View style={styles.objectivesContainer}>
        <Text style={styles.objectivesTitle}>Objectives:</Text>
        {level.objectives.map((objective, index) => (
          <Text key={index} style={styles.objectiveText}>
            • {objective.description}
          </Text>
        ))}
      </View>

      {/* Game Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{gameStats.score.toLocaleString()}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Moves</Text>
          <Text style={styles.statValue}>{gameStats.moves}</Text>
        </View>
        
        {level.timeLimit && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={[styles.statValue, gameStats.timeLeft < 30 ? styles.timeWarning : null]}>
              {formatTime(gameStats.timeLeft)}
            </Text>
          </View>
        )}

        {level.moveLimit && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Moves Left</Text>
            <Text style={styles.statValue}>{level.moveLimit - gameStats.moves}</Text>
          </View>
        )}
      </View>

      {/* Phaser Game Component */}
      <View style={styles.gameContainer}>
        <PhaserGameComponent
          levelConfig={level}
          onGameEnd={handleGameEnd}
          onPause={() => setIsPaused(true)}
          onResume={() => setIsPaused(false)}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleRestart}>
          <Text style={styles.actionButtonText}>🔄 Restart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleQuit}>
          <Text style={styles.actionButtonText}>❌ Quit</Text>
        </TouchableOpacity>
      </View>

      {/* Pause Overlay */}
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>Game Paused</Text>
            <Text style={styles.pauseSubtitle}>
              Level {level.id}: {level.name}
            </Text>
            <TouchableOpacity style={styles.resumeButton} onPress={handlePause}>
              <Text style={styles.resumeButtonText}>Resume Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
              <Text style={styles.quitButtonText}>Quit Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingBottom: 10,
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
  levelName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelInfo: {
    alignItems: 'center',
    marginTop: 4,
  },
  difficultyBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  levelDescription: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
  },
  pauseButton: {
    padding: 8,
  },
  pauseButtonText: {
    fontSize: 20,
  },
  objectivesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  objectivesTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  objectiveText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeWarning: {
    color: '#E74C3C',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    backgroundColor: '#2C3E50',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 250,
  },
  pauseTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pauseSubtitle: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  resumeButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
    minWidth: 150,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
  },
  quitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Fallback styles for non-web platforms
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  fallbackTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fallbackText: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  fallbackButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  fallbackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhaserGameScreen;
