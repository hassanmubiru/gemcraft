import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletConnection, RewardClaim, NFTReward } from '../../types/blockchain';

interface WalletSliceState {
  connection: WalletConnection | null;
  isConnecting: boolean;
  error: string | null;
  rewards: RewardClaim[];
  nfts: NFTReward[];
  lastTransaction: string | null;
}

const initialState: WalletSliceState = {
  connection: null,
  isConnecting: false,
  error: null,
  rewards: [],
  nfts: [],
  lastTransaction: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
    setConnection: (state, action: PayloadAction<WalletConnection>) => {
      state.connection = action.payload;
      state.isConnecting = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    disconnect: (state) => {
      state.connection = null;
      state.rewards = [];
      state.nfts = [];
      state.lastTransaction = null;
    },
    addReward: (state, action: PayloadAction<RewardClaim>) => {
      state.rewards.push(action.payload);
    },
    claimReward: (state, action: PayloadAction<{ id: string; transactionHash: string }>) => {
      const reward = state.rewards.find(r => r.id === action.payload.id);
      if (reward) {
        reward.claimed = true;
        reward.transactionHash = action.payload.transactionHash;
        reward.claimedAt = new Date();
      }
    },
    addNFT: (state, action: PayloadAction<NFTReward>) => {
      state.nfts.push(action.payload);
    },
    mintNFT: (state, action: PayloadAction<{ id: string; transactionHash: string }>) => {
      const nft = state.nfts.find(n => n.id === action.payload.id);
      if (nft) {
        nft.minted = true;
        nft.transactionHash = action.payload.transactionHash;
        nft.mintedAt = new Date();
      }
    },
    setLastTransaction: (state, action: PayloadAction<string>) => {
      state.lastTransaction = action.payload;
    },
    updateBalance: (state, action: PayloadAction<{ CELO: string; cUSD: string; cEUR: string }>) => {
      if (state.connection) {
        state.connection.balance = action.payload;
      }
    },
  },
});

export const {
  setConnecting,
  setConnection,
  setError,
  clearError,
  disconnect,
  addReward,
  claimReward,
  addNFT,
  mintNFT,
  setLastTransaction,
  updateBalance,
} = walletSlice.actions;

export default walletSlice.reducer;
