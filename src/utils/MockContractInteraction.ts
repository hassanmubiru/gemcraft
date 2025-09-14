import { ContractInteraction, LevelReward, PlayerStats, NFTInfo } from './ContractInteraction';

// Mock implementation for testing without actual blockchain
export class MockContractInteraction extends ContractInteraction {
  private mockPlayerStats: PlayerStats = {
    totalScore: '0',
    levelsCompleted: 0,
    totalRewards: '0',
    nftsMinted: 0,
    lastPlayTime: 0
  };

  private mockNFTs: NFTInfo[] = [];
  private mockContractBalance = '1000.0'; // 1000 cUSD

  constructor() {
    // Call parent constructor with mock values
    super('0x0000000000000000000000000000000000000000', {} as any);
  }

  async completeLevel(
    levelId: number,
    score: number,
    targetScore: number
  ): Promise<{
    success: boolean;
    txHash?: string;
    cUSDReward?: string;
    nftMinted?: boolean;
    error?: string;
  }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Get mock reward info
      const rewardInfo = await this.getLevelRewards(levelId);
      if (!rewardInfo.isActive) {
        return { success: false, error: 'Level not active' };
      }

      if (score < targetScore) {
        return { success: false, error: 'Score below target' };
      }

      // Calculate mock rewards
      const performanceMultiplier = this.calculatePerformanceMultiplier(score, targetScore);
      const cUSDReward = (parseFloat(rewardInfo.cUSDReward) * performanceMultiplier / 100).toFixed(6);
      
      // Simulate NFT minting (30% chance)
      const nftMinted = Math.random() < (rewardInfo.nftChance / 100);

      // Update mock stats
      this.mockPlayerStats.totalScore = (parseInt(this.mockPlayerStats.totalScore) + score).toString();
      this.mockPlayerStats.levelsCompleted += 1;
      this.mockPlayerStats.totalRewards = (parseFloat(this.mockPlayerStats.totalRewards) + parseFloat(cUSDReward)).toFixed(6);
      this.mockPlayerStats.lastPlayTime = Date.now();

      if (nftMinted) {
        this.mockPlayerStats.nftsMinted += 1;
        this.mockNFTs.push({
          tokenId: (this.mockNFTs.length + 1).toString(),
          owner: '0x1234567890123456789012345678901234567890',
          tokenURI: `https://gemcraft.celo.org/nft/${this.getRandomGemType()}-${this.getRandomRarity()}.json`
        });
      }

      // Generate mock transaction hash
      const txHash = '0x' + Math.random().toString(16).substr(2, 64);

      return {
        success: true,
        txHash,
        cUSDReward,
        nftMinted
      };
    } catch (error) {
      console.error('Mock contract interaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getLevelRewards(levelId: number): Promise<LevelReward> {
    // Mock level rewards
    const rewards: { [key: number]: LevelReward } = {
      1: { cUSDReward: '0.1', gemReward: '10', nftChance: 1, isActive: true },
      2: { cUSDReward: '0.2', gemReward: '20', nftChance: 2, isActive: true },
      3: { cUSDReward: '0.3', gemReward: '30', nftChance: 3, isActive: true },
      4: { cUSDReward: '0.5', gemReward: '50', nftChance: 5, isActive: true },
      5: { cUSDReward: '0.7', gemReward: '70', nftChance: 7, isActive: true },
      6: { cUSDReward: '1.0', gemReward: '100', nftChance: 10, isActive: true },
      7: { cUSDReward: '1.5', gemReward: '150', nftChance: 15, isActive: true },
      8: { cUSDReward: '2.0', gemReward: '200', nftChance: 20, isActive: true },
      9: { cUSDReward: '3.0', gemReward: '300', nftChance: 30, isActive: true },
      10: { cUSDReward: '5.0', gemReward: '500', nftChance: 50, isActive: true }
    };

    return rewards[levelId] || { cUSDReward: '0.1', gemReward: '10', nftChance: 1, isActive: false };
  }

  async getPlayerStats(playerAddress: string): Promise<PlayerStats> {
    return this.mockPlayerStats;
  }

  async getPlayerNFTCount(playerAddress: string): Promise<number> {
    return this.mockNFTs.length;
  }

  async getPlayerNFTs(playerAddress: string): Promise<NFTInfo[]> {
    return this.mockNFTs;
  }

  async getContractBalance(): Promise<string> {
    return this.mockContractBalance;
  }

  private calculatePerformanceMultiplier(score: number, targetScore: number): number {
    if (score >= targetScore * 2) return 200; // 2x for double target
    if (score >= targetScore * 1.5) return 150; // 1.5x for 150% target
    if (score >= targetScore * 1.25) return 125; // 1.25x for 125% target
    return 100; // Base reward
  }

  private getRandomGemType(): string {
    const gemTypes = ['Ruby', 'Emerald', 'Sapphire', 'Diamond', 'Amethyst', 'Topaz', 'Gold', 'Silver'];
    return gemTypes[Math.floor(Math.random() * gemTypes.length)];
  }

  private getRandomRarity(): string {
    const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    return rarities[Math.floor(Math.random() * rarities.length)];
  }

  // Mock event listeners (no-op for testing)
  onLevelCompleted(callback: (player: string, levelId: number, score: number, cUSDReward: string, nftMinted: boolean) => void): void {
    // Mock implementation - no actual events
  }

  onNFTRewarded(callback: (player: string, tokenId: number, gemType: string, rarity: number) => void): void {
    // Mock implementation - no actual events
  }

  removeAllListeners(): void {
    // Mock implementation - no actual listeners
  }
}
