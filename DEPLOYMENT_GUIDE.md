# 🚀 GemCraft Smart Contract Deployment Guide

## 📋 Overview

This guide will walk you through deploying the GemCraft smart contracts to Celo Alfajores testnet, including the Rewards contract, NFTGem contract, and Leaderboard contract.

## 🔧 Prerequisites

### 1. Environment Setup
- Node.js (v16 or higher)
- npm or yarn
- Git

### 2. Celo Testnet Access
- Celo Alfajores testnet RPC access
- Test CELO tokens from the faucet
- Test cUSD tokens from the faucet

### 3. Required Tools
- Hardhat
- Celo ContractKit
- Wallet with test tokens

## 🛠️ Installation

### 1. Install Dependencies
```bash
cd contracts
npm install
```

### 2. Install Hardhat
```bash
npm install --save-dev hardhat
npx hardhat init
```

### 3. Install Required Packages
```bash
npm install @openzeppelin/contracts
npm install @nomicfoundation/hardhat-toolbox
npm install hardhat-gas-reporter
npm install solidity-coverage
```

## ⚙️ Configuration

### 1. Environment Variables
Create a `.env` file in the contracts directory:

```env
# Celo Alfajores Testnet
PRIVATE_KEY=your_private_key_here
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org

# Contract Addresses (will be filled after deployment)
REWARDS_CONTRACT_ADDRESS=
NFT_GEM_CONTRACT_ADDRESS=
LEADERBOARD_CONTRACT_ADDRESS=

# Celo Token Addresses (Alfajores)
CUSD_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
CELO_ADDRESS=0xF194afDf50B03a69Ea33B7c6CF6a2A4E7B3F8C2D
```

### 2. Hardhat Configuration
The `hardhat.config.js` file is already configured for Celo networks:

```javascript
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 44787,
      gas: 8000000,
      gasPrice: 20000000000,
    },
  },
};
```

## 🚀 Deployment Process

### Step 1: Get Test Tokens

1. **Get CELO from Faucet:**
   - Visit: https://faucet.celo.org/
   - Connect your wallet
   - Request test CELO tokens

2. **Get cUSD from Faucet:**
   - Visit: https://faucet.celo.org/
   - Request test cUSD tokens

### Step 2: Deploy Contracts

Run the enhanced deployment script:

```bash
npx hardhat run scripts/deploy-gemcraft.js --network alfajores
```

This script will:
- Deploy the Rewards contract
- Deploy the NFTGem contract
- Deploy the Leaderboard contract (if available)
- Initialize contracts with proper configuration
- Fund contracts with test tokens
- Mint initial test NFTs
- Save deployment information

### Step 3: Verify Contracts

Run the verification script:

```bash
npx hardhat run scripts/verify-contracts.js --network alfajores
```

This will verify all contracts on Celo Explorer.

### Step 4: Test Contracts

Run the testing script:

```bash
npx hardhat run scripts/test-contracts.js --network alfajores
```

This will test all contract functions and interactions.

## 📊 Contract Details

### Rewards Contract
- **Purpose**: Manages token rewards for game achievements
- **Features**:
  - Daily bonus rewards
  - Level completion rewards
  - Achievement rewards
  - Combo bonus rewards
  - Batch reward claiming
  - Signature verification

### NFTGem Contract
- **Purpose**: ERC-721 NFTs for rare gems and power-ups
- **Features**:
  - Multiple gem types (Ruby, Sapphire, Emerald, Diamond, etc.)
  - Rarity system (Common, Rare, Epic, Legendary)
  - Power system (Normal, RowClear, ColumnClear, Explosive, ColorBomb)
  - Batch minting
  - Player token tracking
  - Metadata URI generation

### Leaderboard Contract
- **Purpose**: Global leaderboard for player rankings
- **Features**:
  - Score tracking
  - Level completion tracking
  - Player rankings
  - Reward distribution

## 🔗 Contract Addresses

After deployment, you'll receive contract addresses like:

```
Rewards Contract: 0x1234567890abcdef...
NFTGem Contract: 0xabcdef1234567890...
Leaderboard Contract: 0x9876543210fedcba...
```

## 📝 Post-Deployment Steps

### 1. Update Environment Variables
Update your `.env` file with the deployed contract addresses:

```env
REWARDS_CONTRACT_ADDRESS=0x1234567890abcdef...
NFT_GEM_CONTRACT_ADDRESS=0xabcdef1234567890...
LEADERBOARD_CONTRACT_ADDRESS=0x9876543210fedcba...
```

### 2. Update Frontend Configuration
Update your frontend configuration files with the new contract addresses.

### 3. Fund Contracts
Ensure contracts have sufficient test tokens for rewards:
- Send test cUSD to the Rewards contract
- Verify balances on Celo Explorer

### 4. Test Integration
- Test wallet connection
- Test reward claiming
- Test NFT minting
- Test game integration

## 🔍 Verification Commands

### Manual Verification
If automatic verification fails, use these commands:

```bash
# Verify Rewards contract
npx hardhat verify --network alfajores <REWARDS_ADDRESS> "<CUSD_ADDRESS>" "<CELO_ADDRESS>"

# Verify NFTGem contract
npx hardhat verify --network alfajores <NFTGEM_ADDRESS> "<BASE_URI>"

# Verify Leaderboard contract
npx hardhat verify --network alfajores <LEADERBOARD_ADDRESS>
```

## 🧪 Testing

### Test Functions
The contracts include comprehensive test functions:

1. **Rewards Contract Tests:**
   - Daily bonus claiming
   - Level completion rewards
   - Achievement rewards
   - Combo bonuses
   - Batch claiming

2. **NFTGem Contract Tests:**
   - NFT minting
   - Batch minting
   - Token transfers
   - Metadata generation
   - Player token tracking

3. **Integration Tests:**
   - Contract interactions
   - Gas optimization
   - Error handling

### Run Tests
```bash
npx hardhat test
```

## 📈 Monitoring

### Celo Explorer
Monitor your contracts on Celo Explorer:
- https://alfajores-blockscout.celo-testnet.org/

### Contract Events
Monitor important events:
- `RewardClaimed`: When players claim rewards
- `GemMinted`: When NFTs are minted
- `LeaderboardUpdated`: When scores are updated

## 🚨 Troubleshooting

### Common Issues

1. **Insufficient Gas:**
   - Increase gas limit in hardhat.config.js
   - Check gas prices on Celo

2. **Verification Failed:**
   - Ensure constructor arguments are correct
   - Check contract source code matches

3. **Transaction Failed:**
   - Check account balance
   - Verify network connection
   - Check contract state

### Error Messages

- `"Daily bonus already claimed"`: Player already claimed today's bonus
- `"Reward already claimed"`: This specific reward was already claimed
- `"Max supply reached"`: NFT contract has reached maximum supply
- `"Invalid signature"`: Signature verification failed

## 🔐 Security Considerations

### Production Deployment
Before mainnet deployment:

1. **Audit Contracts:**
   - Professional security audit
   - Code review
   - Penetration testing

2. **Implement Proper Signatures:**
   - Replace demo signature verification
   - Use proper cryptographic signatures
   - Implement server-side verification

3. **Access Control:**
   - Implement proper role-based access
   - Use multi-signature wallets
   - Implement emergency pause functions

4. **Rate Limiting:**
   - Implement rate limiting for claims
   - Prevent spam attacks
   - Monitor unusual activity

## 📚 Additional Resources

- [Celo Documentation](https://docs.celo.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Celo Explorer](https://explorer.celo.org/)
- [Alfajores Faucet](https://faucet.celo.org/)

## 🎮 Next Steps

After successful deployment:

1. **Integrate with Frontend:**
   - Update contract addresses
   - Test wallet integration
   - Test reward claiming

2. **Game Integration:**
   - Connect game engine to contracts
   - Test level completion rewards
   - Test NFT minting

3. **User Testing:**
   - Deploy to staging environment
   - Conduct user testing
   - Gather feedback

4. **Mainnet Preparation:**
   - Security audit
   - Load testing
   - Documentation review

---

**🎉 Congratulations!** Your GemCraft contracts are now deployed on Celo Alfajores testnet and ready for testing!