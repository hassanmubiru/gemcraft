// Enhanced Celo utilities for GemCraft game integration
import { ContractKit } from '@celo/contractkit';
import { ethers } from 'ethers';
import { walletManager, TOKEN_ADDRESSES } from './CeloWallet';

export interface GameReward {
  cUSD: number;
  gems: number;
  nftChance: number;
  specialReward?: string;
}

export interface NFTMetadata {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'exclusive';
  level: number;
  power: number;
}

export interface GameTransaction {
  hash: string;
  type: 'reward' | 'nft_mint' | 'level_complete' | 'daily_bonus';
  amount?: number;
  tokenId?: number;
  levelId?: number;
  timestamp: number;
}

export class CeloGameUtils {
  private kit: ContractKit | null = null;
  private gameContract: any = null;
  private nftContract: any = null;

  constructor() {
    this.initializeContracts();
  }

  private async initializeContracts() {
    try {
      const walletState = walletManager.getState();
      if (walletState.kit) {
        this.kit = walletState.kit;
        // Initialize game contracts here when deployed
        // this.gameContract = await this.kit.contracts.getContract('GameRewards');
        // this.nftContract = await this.kit.contracts.getContract('NFTGem');
      }
    } catch (error) {
      console.error('Failed to initialize game contracts:', error);
    }
  }

  // Calculate performance-based rewards
  calculateRewards(
    baseReward: GameReward,
    performance: {
      stars: number;
      completionRate: number;
      score: number;
      moves: number;
      timeLeft: number;
    }
  ): GameReward {
    let multiplier = 1.0;

    // Star-based multiplier
    switch (performance.stars) {
      case 1:
        multiplier = 1.0;
        break;
      case 2:
        multiplier = 1.25;
        break;
      case 3:
        multiplier = 1.5;
        break;
      default:
        multiplier = 1.0;
    }

    // Completion rate bonus
    if (performance.completionRate >= 1.0) {
      multiplier += 0.25; // Perfect completion bonus
    }

    // Score efficiency bonus
    const scoreEfficiency = performance.score / Math.max(performance.moves, 1);
    if (scoreEfficiency > 1000) {
      multiplier += 0.1; // High efficiency bonus
    }

    // Time bonus (if applicable)
    if (performance.timeLeft > 0) {
      multiplier += 0.05; // Time remaining bonus
    }

    return {
      cUSD: baseReward.cUSD * multiplier,
      gems: baseReward.gems * multiplier,
      nftChance: Math.min(baseReward.nftChance * multiplier, 1.0),
      specialReward: baseReward.specialReward,
    };
  }

  // Process level completion rewards
  async processLevelRewards(
    levelId: number,
    score: number,
    performance: {
      stars: number;
      completionRate: number;
      score: number;
      moves: number;
      timeLeft: number;
    }
  ): Promise<GameTransaction[]> {
    const transactions: GameTransaction[] = [];

    try {
      // In a real implementation, this would interact with smart contracts
      // For now, we'll simulate the transactions
      
      const baseReward = this.getLevelBaseReward(levelId);
      const calculatedReward = this.calculateRewards(baseReward, performance);

      // Process cUSD reward
      if (calculatedReward.cUSD > 0) {
        const txHash = await this.simulateRewardTransaction(
          'reward',
          calculatedReward.cUSD,
          levelId
        );
        transactions.push({
          hash: txHash,
          type: 'reward',
          amount: calculatedReward.cUSD,
          levelId,
          timestamp: Date.now(),
        });
      }

      // Process NFT minting
      if (calculatedReward.nftChance > 0 && Math.random() < calculatedReward.nftChance) {
        const nftMetadata = this.generateNFTMetadata(levelId, performance);
        const txHash = await this.simulateNFTMint(nftMetadata);
        transactions.push({
          hash: txHash,
          type: 'nft_mint',
          tokenId: nftMetadata.tokenId,
          levelId,
          timestamp: Date.now(),
        });
      }

      // Record level completion
      const completionTxHash = await this.simulateLevelCompletion(levelId, score);
      transactions.push({
        hash: completionTxHash,
        type: 'level_complete',
        levelId,
        timestamp: Date.now(),
      });

      return transactions;
    } catch (error) {
      console.error('Failed to process level rewards:', error);
      throw error;
    }
  }

  // Process daily login bonus
  async processDailyBonus(day: number): Promise<GameTransaction> {
    try {
      const bonus = this.getDailyBonusReward(day);
      const txHash = await this.simulateRewardTransaction(
        'daily_bonus',
        bonus.cUSD,
        day
      );

      return {
        hash: txHash,
        type: 'daily_bonus',
        amount: bonus.cUSD,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Failed to process daily bonus:', error);
      throw error;
    }
  }

  // Get base reward for a level
  private getLevelBaseReward(levelId: number): GameReward {
    // This would typically come from the smart contract
    // For now, we'll use predefined rewards based on level ranges
    if (levelId <= 10) return { cUSD: 0, gems: 0, nftChance: 0 };
    if (levelId <= 20) return { cUSD: 0.5, gems: 50, nftChance: 0 };
    if (levelId <= 30) return { cUSD: 0, gems: 100, nftChance: 0.1 };
    if (levelId <= 40) return { cUSD: 1.0, gems: 200, nftChance: 0 };
    if (levelId <= 50) return { cUSD: 2.0, gems: 300, nftChance: 0.15 };
    if (levelId <= 60) return { cUSD: 0, gems: 250, nftChance: 0.2 };
    if (levelId <= 70) return { cUSD: 3.0, gems: 500, nftChance: 0 };
    if (levelId <= 80) return { cUSD: 5.0, gems: 800, nftChance: 0 };
    if (levelId <= 90) return { cUSD: 0, gems: 1000, nftChance: 0.3 };
    if (levelId <= 95) return { cUSD: 5.0, gems: 1500, nftChance: 0 };
    if (levelId === 100) return { cUSD: 10.0, gems: 5000, nftChance: 1.0 };
    
    return { cUSD: 0, gems: 0, nftChance: 0 };
  }

  // Get daily bonus reward
  private getDailyBonusReward(day: number): GameReward {
    const bonuses = [
      { cUSD: 0.1, gems: 50, nftChance: 0.01 },
      { cUSD: 0.15, gems: 75, nftChance: 0.02 },
      { cUSD: 0.2, gems: 100, nftChance: 0.03 },
      { cUSD: 0.3, gems: 150, nftChance: 0.05 },
      { cUSD: 0.4, gems: 200, nftChance: 0.07 },
      { cUSD: 0.5, gems: 250, nftChance: 0.1 },
      { cUSD: 1.0, gems: 500, nftChance: 0.2 },
    ];
    
    const bonusIndex = (day - 1) % 7;
    return bonuses[bonusIndex];
  }

  // Generate NFT metadata based on level and performance
  private generateNFTMetadata(levelId: number, performance: any): NFTMetadata {
    const rarities = ['common', 'rare', 'epic', 'legendary', 'exclusive'];
    const rarity = this.determineRarity(levelId, performance);
    const power = this.calculateNFTPower(levelId, performance);
    
    return {
      tokenId: Date.now(), // In real implementation, this would come from contract
      name: `GemCraft NFT #${Date.now()}`,
      description: `A rare gem collected from Level ${levelId} with ${performance.stars} stars!`,
      image: this.generateNFTImage(rarity),
      attributes: [
        { trait_type: 'Level', value: levelId },
        { trait_type: 'Stars', value: performance.stars },
        { trait_type: 'Score', value: performance.score },
        { trait_type: 'Power', value: power },
        { trait_type: 'Rarity', value: rarity },
      ],
      rarity,
      level: levelId,
      power,
    };
  }

  // Determine NFT rarity based on level and performance
  private determineRarity(levelId: number, performance: any): 'common' | 'rare' | 'epic' | 'legendary' | 'exclusive' {
    if (levelId >= 100 && performance.stars === 3) return 'exclusive';
    if (levelId >= 80 && performance.stars >= 2) return 'legendary';
    if (levelId >= 50 && performance.stars >= 2) return 'epic';
    if (levelId >= 25 && performance.stars >= 1) return 'rare';
    return 'common';
  }

  // Calculate NFT power based on performance
  private calculateNFTPower(levelId: number, performance: any): number {
    let power = levelId * 10; // Base power from level
    power += performance.stars * 50; // Star bonus
    power += Math.floor(performance.score / 1000) * 5; // Score bonus
    return Math.min(power, 1000); // Cap at 1000
  }

  // Generate NFT image based on rarity
  private generateNFTImage(rarity: string): string {
    const images = {
      common: 'https://via.placeholder.com/300x300/4CAF50/white?text=Common+Gem',
      rare: 'https://via.placeholder.com/300x300/2196F3/white?text=Rare+Gem',
      epic: 'https://via.placeholder.com/300x300/9C27B0/white?text=Epic+Gem',
      legendary: 'https://via.placeholder.com/300x300/FF9800/white?text=Legendary+Gem',
      exclusive: 'https://via.placeholder.com/300x300/F44336/white?text=Exclusive+Gem',
    };
    return images[rarity as keyof typeof images] || images.common;
  }

  // Simulate reward transaction (replace with real contract interaction)
  private async simulateRewardTransaction(
    type: string,
    amount: number,
    levelId: number
  ): Promise<string> {
    // In a real implementation, this would call the smart contract
    // For now, we'll generate a mock transaction hash
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Simulated ${type} transaction:`, {
      hash: mockHash,
      amount,
      levelId,
    });
    
    return mockHash;
  }

  // Simulate NFT minting (replace with real contract interaction)
  private async simulateNFTMint(metadata: NFTMetadata): Promise<string> {
    // In a real implementation, this would call the NFT contract
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Simulated NFT mint:', {
      hash: mockHash,
      metadata,
    });
    
    return mockHash;
  }

  // Simulate level completion (replace with real contract interaction)
  private async simulateLevelCompletion(levelId: number, score: number): Promise<string> {
    // In a real implementation, this would call the game contract
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Simulated level completion:', {
      hash: mockHash,
      levelId,
      score,
    });
    
    return mockHash;
  }

  // Get transaction history
  async getTransactionHistory(address: string): Promise<GameTransaction[]> {
    try {
      // In a real implementation, this would query the blockchain
      // For now, we'll return mock data
      const mockTransactions: GameTransaction[] = [
        {
          hash: '0x1234567890abcdef',
          type: 'level_complete',
          levelId: 1,
          timestamp: Date.now() - 86400000,
        },
        {
          hash: '0xabcdef1234567890',
          type: 'reward',
          amount: 0.5,
          levelId: 20,
          timestamp: Date.now() - 172800000,
        },
      ];
      
      return mockTransactions;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  // Get player statistics
  async getPlayerStats(address: string): Promise<{
    levelsCompleted: number;
    totalScore: number;
    nftsOwned: number;
    totalRewards: number;
    rank: number;
  }> {
    try {
      // In a real implementation, this would query the contracts
      // For now, we'll return mock data
      return {
        levelsCompleted: 25,
        totalScore: 150000,
        nftsOwned: 3,
        totalRewards: 5.5,
        rank: 42,
      };
    } catch (error) {
      console.error('Failed to get player stats:', error);
      return {
        levelsCompleted: 0,
        totalScore: 0,
        nftsOwned: 0,
        totalRewards: 0,
        rank: 0,
      };
    }
  }

  // Check if level is unlocked
  async isLevelUnlocked(levelId: number, address: string): Promise<boolean> {
    try {
      // In a real implementation, this would check the contract
      // For now, we'll use simple logic
      return levelId <= 30; // Mock: first 30 levels unlocked
    } catch (error) {
      console.error('Failed to check level unlock status:', error);
      return false;
    }
  }

  // Get leaderboard data
  async getLeaderboard(limit: number = 100): Promise<{
    rank: number;
    address: string;
    score: number;
    levelsCompleted: number;
  }[]> {
    try {
      // In a real implementation, this would query the contract
      // For now, we'll return mock data
      const mockLeaderboard = Array.from({ length: limit }, (_, i) => ({
        rank: i + 1,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        score: Math.floor(Math.random() * 1000000),
        levelsCompleted: Math.floor(Math.random() * 100),
      }));
      
      return mockLeaderboard.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return [];
    }
  }
}

// Global instance
export const celoGameUtils = new CeloGameUtils();
