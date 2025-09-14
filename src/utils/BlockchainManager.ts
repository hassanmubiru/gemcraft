import { ContractInteraction, createContractInteraction, CONTRACT_ADDRESSES } from './ContractInteraction';
import { MockContractInteraction } from './MockContractInteraction';
import { ContractKit } from '@celo/contractkit';

export type BlockchainMode = 'mock' | 'real';

export class BlockchainManager {
  private mode: BlockchainMode;
  private mockContract?: MockContractInteraction;
  private realContract?: ContractInteraction;

  constructor(mode: BlockchainMode = 'mock') {
    this.mode = mode;
    
    if (mode === 'mock') {
      this.mockContract = new MockContractInteraction();
    }
  }

  /**
   * Switch between mock and real blockchain mode
   */
  public setMode(mode: BlockchainMode, kit?: ContractKit): void {
    this.mode = mode;
    
    if (mode === 'mock') {
      this.mockContract = new MockContractInteraction();
      this.realContract = undefined;
    } else if (mode === 'real' && kit) {
      const contractAddress = CONTRACT_ADDRESSES.alfajores.GemCraftRewards;
      if (contractAddress !== '0x0000000000000000000000000000000000000000') {
        this.realContract = createContractInteraction(contractAddress, kit);
        this.mockContract = undefined;
      } else {
        console.warn('Real contract not deployed yet, falling back to mock mode');
        this.setMode('mock');
      }
    }
  }

  /**
   * Get the current contract interaction instance
   */
  public getContractInteraction(): MockContractInteraction | ContractInteraction {
    if (this.mode === 'mock' && this.mockContract) {
      return this.mockContract;
    } else if (this.mode === 'real' && this.realContract) {
      return this.realContract;
    } else {
      // Fallback to mock if real contract not available
      if (!this.mockContract) {
        this.mockContract = new MockContractInteraction();
      }
      return this.mockContract;
    }
  }

  /**
   * Check if real blockchain is available
   */
  public isRealBlockchainAvailable(): boolean {
    return CONTRACT_ADDRESSES.alfajores.GemCraftRewards !== '0x0000000000000000000000000000000000000000';
  }

  /**
   * Get current mode
   */
  public getMode(): BlockchainMode {
    return this.mode;
  }

  /**
   * Get mode display name
   */
  public getModeDisplayName(): string {
    switch (this.mode) {
      case 'mock':
        return 'Test Mode (Mock Blockchain)';
      case 'real':
        return 'Live Mode (Real Blockchain)';
      default:
        return 'Unknown Mode';
    }
  }

  /**
   * Get mode description
   */
  public getModeDescription(): string {
    switch (this.mode) {
      case 'mock':
        return 'Using simulated blockchain for testing. No real transactions or rewards.';
      case 'real':
        return 'Using real Celo blockchain. Real cUSD rewards and NFT minting.';
      default:
        return 'Unknown mode';
    }
  }

  /**
   * Check if rewards are real
   */
  public areRewardsReal(): boolean {
    return this.mode === 'real' && this.isRealBlockchainAvailable();
  }
}

// Global blockchain manager instance
export const blockchainManager = new BlockchainManager('mock');
