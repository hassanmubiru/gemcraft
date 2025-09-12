// Blockchain and Celo specific types

export interface CeloNetwork {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ContractAddresses {
  rewards: string;
  nftGem: string;
  leaderboard: string;
  testCUSD: string;
  testCELO: string;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  gasUsed: string;
  blockNumber: number;
  error?: string;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  address: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

export interface RewardClaim {
  id: string;
  type: 'daily_bonus' | 'level_complete' | 'achievement' | 'combo_bonus';
  amount: number;
  tokenType: 'CELO' | 'cUSD' | 'cEUR';
  claimed: boolean;
  transactionHash?: string;
  claimedAt?: Date;
}

export interface NFTReward {
  id: string;
  tokenId: string;
  gemType: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  power: string;
  metadata: NFTMetadata;
  minted: boolean;
  transactionHash?: string;
  mintedAt?: Date;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  totalPlayers: number;
  lastUpdated: Date;
  userRank?: number;
}

export interface LeaderboardEntry {
  address: string;
  score: number;
  level: number;
  timestamp: Date;
  rank: number;
  displayName?: string;
}

// Contract interaction types
export interface ContractConfig {
  address: string;
  abi: any[];
  network: CeloNetwork;
}

export interface ContractCall {
  method: string;
  params: any[];
  value?: string;
  gasLimit?: string;
}

export interface ContractEvent {
  event: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
}

// Wallet connection types
export interface WalletInfo {
  name: string;
  icon: string;
  connector: any;
  isInstalled: boolean;
  downloadUrl?: string;
}

export interface ConnectionState {
  isConnected: boolean;
  address?: string;
  chainId?: number;
  error?: string;
  isConnecting: boolean;
}

// Admin types
export interface AdminConfig {
  rewardAmounts: {
    dailyBonus: number;
    levelComplete: number;
    achievement: number;
    comboBonus: number;
  };
  nftDropRates: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  contractAddresses: ContractAddresses;
  isPaused: boolean;
}

export interface AdminStats {
  totalRewardsDistributed: number;
  totalNFTsMinted: number;
  activePlayers: number;
  totalTransactions: number;
  contractBalance: TokenBalance[];
}
