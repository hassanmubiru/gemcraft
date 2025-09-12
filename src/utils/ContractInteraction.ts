import { ContractKit } from '@celo/contractkit';
import { ethers } from 'ethers';

// Contract ABI (simplified for demo)
const GEMCRAFT_REWARDS_ABI = [
  // Level completion
  "function completeLevel(uint256 levelId, uint256 score, uint256 targetScore) external",
  
  // View functions
  "function levelRewards(uint256) external view returns (uint256 cUSDReward, uint256 gemReward, uint256 nftChance, bool isActive)",
  "function playerStats(address) external view returns (uint256 totalScore, uint256 levelsCompleted, uint256 totalRewards, uint256 nftsMinted, uint256 lastPlayTime)",
  "function getPlayerNFTCount(address) external view returns (uint256)",
  "function getPlayerNFTs(address) external view returns (uint256[])",
  "function getContractBalance() external view returns (uint256)",
  
  // Events
  "event LevelCompleted(address indexed player, uint256 levelId, uint256 score, uint256 cUSDReward, uint256 gemReward, bool nftMinted)",
  "event NFTRewarded(address indexed player, uint256 tokenId, string gemType, uint256 rarity)",
  
  // ERC721 functions
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)"
];

export interface LevelReward {
  cUSDReward: string;
  gemReward: string;
  nftChance: number;
  isActive: boolean;
}

export interface PlayerStats {
  totalScore: string;
  levelsCompleted: number;
  totalRewards: string;
  nftsMinted: number;
  lastPlayTime: number;
}

export interface NFTInfo {
  tokenId: string;
  owner: string;
  tokenURI: string;
}

export class ContractInteraction {
  private contract: ethers.Contract;
  private kit: ContractKit;

  constructor(contractAddress: string, kit: ContractKit) {
    this.kit = kit;
    this.contract = new ethers.Contract(
      contractAddress,
      GEMCRAFT_REWARDS_ABI,
      kit.web3.eth.currentProvider
    );
  }

  /**
   * Complete a level and claim rewards
   */
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
    try {
      // Get the reward info first
      const rewardInfo = await this.getLevelRewards(levelId);
      if (!rewardInfo.isActive) {
        return { success: false, error: 'Level not active' };
      }

      // Estimate gas
      const gasEstimate = await this.contract.estimateGas.completeLevel(
        levelId,
        score,
        targetScore
      );

      // Send transaction
      const tx = await this.contract.completeLevel(levelId, score, targetScore, {
        gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Parse events to get reward details
      const levelCompletedEvent = receipt.events?.find(
        (e: any) => e.event === 'LevelCompleted'
      );
      const nftRewardedEvent = receipt.events?.find(
        (e: any) => e.event === 'NFTRewarded'
      );

      return {
        success: true,
        txHash: receipt.transactionHash,
        cUSDReward: levelCompletedEvent?.args?.cUSDReward?.toString(),
        nftMinted: nftRewardedEvent !== undefined
      };
    } catch (error) {
      console.error('Failed to complete level:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get level rewards configuration
   */
  async getLevelRewards(levelId: number): Promise<LevelReward> {
    try {
      const rewards = await this.contract.levelRewards(levelId);
      return {
        cUSDReward: ethers.utils.formatEther(rewards.cUSDReward),
        gemReward: rewards.gemReward.toString(),
        nftChance: rewards.nftChance.toNumber(),
        isActive: rewards.isActive
      };
    } catch (error) {
      console.error('Failed to get level rewards:', error);
      throw error;
    }
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(playerAddress: string): Promise<PlayerStats> {
    try {
      const stats = await this.contract.playerStats(playerAddress);
      return {
        totalScore: stats.totalScore.toString(),
        levelsCompleted: stats.levelsCompleted.toNumber(),
        totalRewards: ethers.utils.formatEther(stats.totalRewards),
        nftsMinted: stats.nftsMinted.toNumber(),
        lastPlayTime: stats.lastPlayTime.toNumber()
      };
    } catch (error) {
      console.error('Failed to get player stats:', error);
      throw error;
    }
  }

  /**
   * Get player's NFT count
   */
  async getPlayerNFTCount(playerAddress: string): Promise<number> {
    try {
      const count = await this.contract.getPlayerNFTCount(playerAddress);
      return count.toNumber();
    } catch (error) {
      console.error('Failed to get NFT count:', error);
      return 0;
    }
  }

  /**
   * Get player's NFTs
   */
  async getPlayerNFTs(playerAddress: string): Promise<NFTInfo[]> {
    try {
      const tokenIds = await this.contract.getPlayerNFTs(playerAddress);
      const nfts: NFTInfo[] = [];

      for (const tokenId of tokenIds) {
        try {
          const owner = await this.contract.ownerOf(tokenId);
          const tokenURI = await this.contract.tokenURI(tokenId);
          
          nfts.push({
            tokenId: tokenId.toString(),
            owner,
            tokenURI
          });
        } catch (error) {
          console.warn(`Failed to get NFT ${tokenId}:`, error);
        }
      }

      return nfts;
    } catch (error) {
      console.error('Failed to get player NFTs:', error);
      return [];
    }
  }

  /**
   * Get contract balance
   */
  async getContractBalance(): Promise<string> {
    try {
      const balance = await this.contract.getContractBalance();
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Failed to get contract balance:', error);
      return '0';
    }
  }

  /**
   * Listen to contract events
   */
  onLevelCompleted(
    callback: (player: string, levelId: number, score: number, cUSDReward: string, nftMinted: boolean) => void
  ): void {
    this.contract.on('LevelCompleted', (player, levelId, score, cUSDReward, gemReward, nftMinted) => {
      callback(
        player,
        levelId.toNumber(),
        score.toNumber(),
        ethers.utils.formatEther(cUSDReward),
        nftMinted
      );
    });
  }

  onNFTRewarded(
    callback: (player: string, tokenId: number, gemType: string, rarity: number) => void
  ): void {
    this.contract.on('NFTRewarded', (player, tokenId, gemType, rarity) => {
      callback(
        player,
        tokenId.toNumber(),
        gemType,
        rarity.toNumber()
      );
    });
  }

  /**
   * Remove event listeners
   */
  removeAllListeners(): void {
    this.contract.removeAllListeners();
  }
}

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  alfajores: {
    GemCraftRewards: '0x0000000000000000000000000000000000000000', // Will be set after deployment
    cUSD: '0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4'
  },
  mainnet: {
    GemCraftRewards: '0x0000000000000000000000000000000000000000', // Will be set after deployment
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a'
  }
};

// Helper function to create contract interaction instance
export const createContractInteraction = (
  contractAddress: string,
  kit: ContractKit
): ContractInteraction => {
  return new ContractInteraction(contractAddress, kit);
};
