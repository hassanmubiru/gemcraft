# 🚀 GemCraft Smart Contract Deployment Guide

## 📋 Prerequisites

### 1. Environment Setup
```bash
# Install dependencies
cd contracts
npm install

# Create environment file
cp env.example .env
```

### 2. Configure Environment Variables
Edit `.env` file with your test private key:
```bash
# Celo Alfajores Testnet Configuration
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
ALFAJORES_CHAIN_ID=44787
ALFAJORES_EXPLORER_URL=https://explorer.celo.org/alfajores

# Private Key for deployment (TEST ONLY - NEVER USE PRODUCTION KEYS)
PRIVATE_KEY=your_test_private_key_here

# Test Token Addresses (Alfajores)
TEST_CUSD_ADDRESS=0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4
TEST_CELO_ADDRESS=0xF194afDf50B03a69Ea33B7c6CF6a2A4E7B3F8C2D

# Gas Configuration
GAS_LIMIT=8000000
GAS_PRICE=20000000000
```

### 3. Get Test Tokens
1. Visit [Celo Faucet](https://faucet.celo.org/)
2. Connect your wallet
3. Request test cUSD tokens
4. Ensure you have at least 1 cUSD for deployment gas

## 🚀 Deployment Steps

### Step 1: Compile Contracts
```bash
cd contracts
npx hardhat compile
```

### Step 2: Deploy to Alfajores Testnet
```bash
# Deploy the main rewards contract
npx hardhat run scripts/deploy-gemcraft.js --network alfajores
```

### Step 3: Fund the Contract
After deployment, you need to fund the contract with cUSD tokens:
```bash
# Transfer cUSD to the deployed contract address
# This can be done through the Celo wallet or programmatically
```

### Step 4: Update Frontend Configuration
Update the contract address in the frontend:
```typescript
// src/utils/ContractInteraction.ts
export const CONTRACT_ADDRESSES = {
  alfajores: {
    GemCraftRewards: '0x...', // Your deployed contract address
    cUSD: '0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4'
  }
};
```

### Step 5: Test the Integration
1. Start the frontend: `npm start`
2. Connect a Celo wallet
3. Play a level and claim rewards
4. Verify transactions on [Alfajores Explorer](https://alfajores-blockscout.celo-testnet.org/)

## 🔧 Contract Details

### GemCraftRewards Contract
- **Purpose**: Handles level completion rewards and NFT minting
- **Features**: 
  - cUSD token rewards
  - NFT minting with rarity system
  - Performance-based multipliers
  - Player statistics tracking

### Contract Functions
- `completeLevel(levelId, score, targetScore)`: Complete a level and claim rewards
- `getPlayerStats(address)`: Get player statistics
- `getPlayerNFTs(address)`: Get player's NFT collection
- `getContractBalance()`: Check contract's cUSD balance

## 📊 Deployment Verification

### 1. Contract Deployment
- ✅ Contract deployed successfully
- ✅ Contract address recorded
- ✅ Constructor parameters set correctly

### 2. Contract Funding
- ✅ Contract funded with cUSD tokens
- ✅ Sufficient balance for rewards
- ✅ Owner permissions set

### 3. Frontend Integration
- ✅ Contract address updated
- ✅ ABI imported correctly
- ✅ Wallet connection working
- ✅ Transaction signing working

### 4. End-to-End Testing
- ✅ Level completion working
- ✅ Reward claiming working
- ✅ NFT minting working
- ✅ Transaction confirmation working

## 🎯 Expected Results

### Successful Deployment
```
🚀 Deploying GemCraft Rewards Contract...
📦 Deploying contract...
⏳ Waiting for deployment...
✅ GemCraft Rewards Contract deployed to: 0x...
🔗 Contract on Alfajores Explorer: https://alfajores-blockscout.celo-testnet.org/address/0x...
💰 Contract cUSD balance: 0.0
🎮 Level 1 rewards: { cUSD: '0.1', gems: '10', nftChance: '1%', active: true }
🎉 Deployment completed successfully!
```

### Contract Interaction
- Players can complete levels and claim cUSD rewards
- NFT minting occurs based on level chance percentages
- Performance multipliers apply based on score vs target
- All transactions are recorded on the blockchain

## 🚨 Troubleshooting

### Common Issues

#### 1. Deployment Fails
- **Cause**: Insufficient gas or network issues
- **Solution**: Increase gas limit or check network connection

#### 2. Contract Not Funded
- **Cause**: No cUSD tokens in contract
- **Solution**: Transfer cUSD tokens to contract address

#### 3. Frontend Can't Connect
- **Cause**: Wrong contract address or ABI
- **Solution**: Verify contract address and ABI in frontend

#### 4. Transactions Fail
- **Cause**: Insufficient gas or contract not funded
- **Solution**: Check gas settings and contract balance

### Debug Commands
```bash
# Check contract balance
npx hardhat run scripts/check-balance.js --network alfajores

# Verify contract deployment
npx hardhat verify --network alfajores <CONTRACT_ADDRESS>

# Test contract functions
npx hardhat run scripts/test-contract.js --network alfajores
```

## 📈 Post-Deployment

### 1. Monitor Contract
- Track contract balance
- Monitor reward distributions
- Watch for NFT mints

### 2. User Testing
- Test with multiple wallets
- Verify reward calculations
- Test NFT minting rates

### 3. Performance Optimization
- Monitor gas usage
- Optimize contract functions
- Update reward rates if needed

## 🎉 Success Criteria

- ✅ Contract deployed to Alfajores testnet
- ✅ Contract funded with cUSD tokens
- ✅ Frontend connected to real contract
- ✅ Players can claim real cUSD rewards
- ✅ NFT minting working with real transactions
- ✅ All transactions visible on blockchain explorer

---

**Status**: Ready for deployment when environment is properly configured!