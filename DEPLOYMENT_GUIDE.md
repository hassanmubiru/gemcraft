# 🚀 GemCraft Deployment Guide

## 📋 Prerequisites

### **Required Tools**
- Node.js (v16+)
- npm or yarn
- Git
- Celo wallet with testnet funds

### **Required Accounts**
- Celo Alfajores testnet account
- cUSD tokens for contract funding
- CELO tokens for gas fees

## 🔧 Setup Instructions

### **1. Install Dependencies**
```bash
# Install Celo dependencies
npm install @celo/contractkit @celo/wallet-base @celo/wallet-ledger @celo/wallet-walletconnect ethers

# Install OpenZeppelin contracts
cd contracts
npm install @openzeppelin/contracts
```

### **2. Configure Environment**
```bash
# Copy environment template
cp contracts/env.example contracts/.env

# Edit .env file with your private key
nano contracts/.env
```

**Required Environment Variables:**
```env
PRIVATE_KEY=your_private_key_here
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
```

### **3. Get Testnet Funds**
1. **Visit Celo Faucet**: https://celo.org/developers/faucet
2. **Enter your wallet address**
3. **Request cUSD and CELO tokens**
4. **Wait for confirmation**

## 🏗️ Smart Contract Deployment

### **1. Compile Contracts**
```bash
cd contracts
npx hardhat compile
```

### **2. Run Tests**
```bash
npx hardhat test
```

### **3. Deploy to Alfajores**
```bash
npx hardhat run scripts/deploy-gemcraft.js --network alfajores
```

**Expected Output:**
```
🚀 Deploying GemCraft Rewards Contract...
📦 Deploying contract...
✅ GemCraft Rewards Contract deployed to: 0x...
🔗 Contract on Alfajores Explorer: https://alfajores-blockscout.celo-testnet.org/address/0x...
```

### **4. Fund Contract**
```bash
# Transfer cUSD to contract for rewards
# Example: 1000 cUSD for initial rewards pool
```

## 🎮 Frontend Integration

### **1. Update Contract Address**
```typescript
// Update src/utils/ContractInteraction.ts
export const CONTRACT_ADDRESSES = {
  alfajores: {
    GemCraftRewards: '0x...', // Your deployed contract address
    cUSD: '0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4'
  }
};
```

### **2. Test Wallet Connection**
1. **Start the game**: `npm start`
2. **Open browser**: http://localhost:8081
3. **Connect wallet** using WalletConnect or browser wallet
4. **Verify connection** in game interface

### **3. Test Reward System**
1. **Play a level** and achieve target score
2. **Click "Claim Rewards"** on result screen
3. **Confirm transaction** in wallet
4. **Verify cUSD received** and potential NFT minted

## 🔍 Verification & Testing

### **Contract Verification**
```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS> <cUSD_ADDRESS>
```

### **Test Scenarios**
1. **Level Completion**: Complete level 1 with target score
2. **Reward Claiming**: Claim cUSD rewards
3. **NFT Minting**: Check for NFT rewards
4. **Performance Multipliers**: Test high scores
5. **Error Handling**: Test invalid inputs

### **Monitoring**
- **Contract Balance**: Monitor cUSD balance
- **Transaction History**: Track all interactions
- **Event Logs**: Monitor LevelCompleted and NFTRewarded events
- **Player Stats**: Track player progress

## 🚨 Troubleshooting

### **Common Issues**

#### **"Insufficient funds" Error**
- **Solution**: Add more cUSD to contract
- **Check**: Contract balance using `getContractBalance()`

#### **"Wallet not connected" Error**
- **Solution**: Ensure wallet is properly connected
- **Check**: Wallet state in browser console

#### **"Transaction failed" Error**
- **Solution**: Check gas limits and network status
- **Check**: Alfajores network connectivity

#### **"Contract not deployed" Error**
- **Solution**: Verify contract address is correct
- **Check**: Contract exists on Alfajores explorer

### **Debug Commands**
```bash
# Check contract balance
npx hardhat run scripts/check-balance.js --network alfajores

# View contract events
npx hardhat run scripts/view-events.js --network alfajores

# Test contract functions
npx hardhat run scripts/test-contract.js --network alfajores
```

## 📊 Post-Deployment Checklist

### **Smart Contract**
- [ ] Contract deployed successfully
- [ ] Contract verified on explorer
- [ ] Contract funded with cUSD
- [ ] Level rewards configured
- [ ] Admin functions tested

### **Frontend**
- [ ] Contract address updated
- [ ] Wallet connection working
- [ ] Reward claiming functional
- [ ] NFT minting working
- [ ] Error handling tested

### **Testing**
- [ ] Level completion tested
- [ ] Reward distribution verified
- [ ] NFT minting confirmed
- [ ] Performance multipliers working
- [ ] Edge cases handled

## 🎯 Production Deployment

### **Mainnet Deployment**
1. **Update network**: Change from alfajores to mainnet
2. **Update addresses**: Use mainnet cUSD address
3. **Fund contract**: Transfer real cUSD tokens
4. **Update frontend**: Point to mainnet contract
5. **Monitor closely**: Track all transactions

### **Security Considerations**
- **Audit contracts**: Professional security audit
- **Test thoroughly**: Comprehensive testing
- **Monitor activity**: Real-time monitoring
- **Backup keys**: Secure key management
- **Emergency procedures**: Pause functionality

## 📈 Scaling & Optimization

### **Performance Optimization**
- **Gas optimization**: Reduce transaction costs
- **Batch operations**: Group multiple actions
- **Caching**: Cache frequently accessed data
- **CDN**: Use content delivery network

### **Feature Expansion**
- **More levels**: Add additional game levels
- **New rewards**: Introduce new reward types
- **Social features**: Add player interactions
- **Tournaments**: Competitive events

---

## 🎉 Deployment Complete!

Your GemCraft game is now ready for blockchain integration:

- ✅ **Smart contracts deployed** and verified
- ✅ **Frontend integrated** with wallet connection
- ✅ **Reward system active** with real cUSD tokens
- ✅ **NFT minting functional** with unique gem NFTs
- ✅ **Testing completed** and verified

**Ready to earn real rewards while playing!** 🚀💰
