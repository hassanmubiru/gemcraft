import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';
import { createContractInteraction, CONTRACT_ADDRESSES } from '../utils/ContractInteraction';
import { MockContractInteraction } from '../utils/MockContractInteraction';
import { getLevelById } from '../data/testLevels';

const { width, height } = Dimensions.get('window');

interface GameResultScreenProps {
  route: {
    params: {
      score: number;
      success: boolean;
      level: {
        id: number;
        name: string;
        targetScore: number;
      };
    };
  };
}

const GameResultScreen: React.FC<GameResultScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { score, success, level } = route.params;
  const { walletState, updateBalance } = useWallet();
  
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [actualReward, setActualReward] = useState<string>('0');
  const [levelConfig, setLevelConfig] = useState(getLevelById(level.id));

  const getStars = (): number => {
    const percentage = (score / level.targetScore) * 100;
    if (percentage >= 100) return 3;
    if (percentage >= 75) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  // Claim rewards from blockchain (using mock for testing)
  const claimRewards = async () => {
    setIsClaimingRewards(true);
    
    try {
      // Use mock contract interaction for testing
      const contractInteraction = new MockContractInteraction();
      
      const result = await contractInteraction.completeLevel(
        level.id,
        score,
        level.targetScore
      );

      if (result.success) {
        setRewardsClaimed(true);
        setActualReward(result.cUSDReward || '0');
        setNftMinted(result.nftMinted || false);
        
        Alert.alert(
          '🎉 Rewards Claimed!',
          `You earned ${result.cUSDReward} cUSD${result.nftMinted ? ' and a rare NFT!' : '!'}\n\nTransaction: ${result.txHash}`
        );
      } else {
        Alert.alert('Claim Failed', result.error || 'Failed to claim rewards');
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
      Alert.alert('Error', 'Failed to claim rewards. Please try again.');
    } finally {
      setIsClaimingRewards(false);
    }
  };

  const getRewardText = (): string => {
    if (!success) return 'Better luck next time!';
    
    if (rewardsClaimed) {
      return `You earned ${actualReward} cUSD${nftMinted ? ' and a rare NFT!' : '!'}`;
    }
    
    if (levelConfig) {
      const stars = getStars();
      const performanceMultiplier = stars >= 3 ? 2.0 : stars >= 2 ? 1.5 : stars >= 1 ? 1.25 : 1.0;
      const totalReward = levelConfig.rewards.cUSD * performanceMultiplier;
      
      return `You can earn up to ${totalReward.toFixed(2)} cUSD!`;
    }
    
    return 'You can earn rewards!';
  };

  const renderStars = () => {
    const stars = getStars();
    const starElements = [];
    
    for (let i = 0; i < 3; i++) {
      starElements.push(
        <Text
          key={i}
          style={[
            styles.star,
            i < stars && styles.starFilled,
          ]}
        >
          ⭐
        </Text>
      );
    }
    
    return starElements;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Result Header */}
        <View style={styles.header}>
          <Text style={styles.resultIcon}>
            {success ? '🎉' : '😔'}
          </Text>
          <Text style={styles.resultTitle}>
            {success ? 'Level Complete!' : 'Level Failed'}
          </Text>
          <Text style={styles.levelName}>{level.name}</Text>
        </View>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          <Text style={styles.targetScore}>
            Target: {level.targetScore.toLocaleString()}
          </Text>
        </View>

        {/* Stars */}
        <View style={styles.starsContainer}>
          <Text style={styles.starsLabel}>Rating</Text>
          <View style={styles.starsRow}>
            {renderStars()}
          </View>
        </View>

        {/* Rewards */}
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>Rewards</Text>
          <Text style={styles.rewardsText}>{getRewardText()}</Text>
          
          {success && levelConfig && (
            <View style={styles.rewardBreakdown}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>💰</Text>
                <Text style={styles.rewardText}>cUSD: +{levelConfig.rewards.cUSD}</Text>
              </View>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>💎</Text>
                <Text style={styles.rewardText}>Gems: +{levelConfig.rewards.gems}</Text>
              </View>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>🎨</Text>
                <Text style={styles.rewardText}>NFT Chance: {levelConfig.rewards.nftChance}%</Text>
              </View>
              {getStars() >= 2 && (
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>⭐</Text>
                  <Text style={styles.rewardText}>Performance Bonus: {getStars() >= 3 ? '2x' : '1.5x'}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {success && !rewardsClaimed && (
            <TouchableOpacity
              style={[styles.primaryButton, isClaimingRewards && styles.disabledButton]}
              onPress={claimRewards}
              disabled={isClaimingRewards}
            >
              {isClaimingRewards ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.primaryButtonText}>Claiming...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>💰 Claim Rewards (Test Mode)</Text>
              )}
            </TouchableOpacity>
          )}
          
          {success && rewardsClaimed && (
            <View style={styles.claimedContainer}>
              <Text style={styles.claimedText}>✅ Rewards Claimed!</Text>
              {nftMinted && (
                <Text style={styles.nftText}>🎨 You also received a rare NFT!</Text>
              )}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('LevelSelect' as never)}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <Text style={styles.secondaryButtonText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resultIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  levelName: {
    fontSize: 18,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2ECC71',
    marginBottom: 5,
  },
  targetScore: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  starsLabel: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 15,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    fontSize: 40,
    color: '#333',
    marginHorizontal: 10,
  },
  starFilled: {
    color: '#FFD700',
  },
  rewardsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 40,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  rewardsText: {
    fontSize: 16,
    color: '#2ECC71',
    textAlign: 'center',
    marginBottom: 20,
  },
  rewardBreakdown: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  rewardText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  actionsContainer: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A0A0A0',
  },
  secondaryButtonText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontWeight: '600',
  },
  walletButton: {
    backgroundColor: '#F39C12',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  claimedContainer: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  claimedText: {
    color: '#2ECC71',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nftText: {
    color: '#F39C12',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GameResultScreen;
