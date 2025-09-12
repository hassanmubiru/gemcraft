# Deployment Guide for GemCraft

This guide covers deploying GemCraft to Celo Alfajores testnet and preparing for production deployment.

## 🚀 Quick Deployment

### Prerequisites

1. **Node.js 18+** installed
2. **Test CELO** from Alfajores faucet
3. **Private key** for deployment (TEST ONLY)
4. **Git** for version control

### Step 1: Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd gemcraft
```

2. Install dependencies:
```bash
npm install
cd contracts && npm install && cd ..
```

3. Create environment file:
```bash
cp contracts/env.example contracts/.env
```

4. Edit `contracts/.env` with your test private key:
```env
PRIVATE_KEY=your_test_private_key_here
```

### Step 2: Get Test Tokens

1. Visit [Celo Alfajores Faucet](https://faucet.celo.org/)
2. Enter your wallet address
3. Request test CELO and cUSD
4. Wait for tokens to arrive (usually within minutes)

### Step 3: Deploy Contracts

```bash
# Compile contracts
npm run hardhat:compile

# Deploy to Alfajores
npm run hardhat:deploy:alfajores
```

### Step 4: Update Frontend Configuration

After deployment, update your `.env` file with the deployed contract addresses:

```env
REWARDS_CONTRACT_ADDRESS=0x...
NFT_GEM_CONTRACT_ADDRESS=0x...
LEADERBOARD_CONTRACT_ADDRESS=0x...
```

### Step 5: Fund Contracts

1. Send test cUSD to the rewards contract
2. Use the admin dashboard to manage funds
3. Test reward distribution

## 🔧 Detailed Deployment Steps

### Smart Contract Deployment

#### 1. Contract Compilation

```bash
cd contracts
npx hardhat compile
```

This will:
- Compile all Solidity contracts
- Generate TypeScript bindings
- Create deployment artifacts

#### 2. Contract Testing

```bash
npx hardhat test
```

Run the test suite to ensure contracts work correctly:
- Reward distribution
- NFT minting
- Leaderboard functionality
- Access controls

#### 3. Gas Optimization

```bash
REPORT_GAS=true npx hardhat test
```

Review gas usage and optimize if needed.

#### 4. Deployment Script

The deployment script (`scripts/deploy.js`) will:
- Deploy all three contracts
- Set up initial configuration
- Save deployment information
- Provide verification commands

#### 5. Contract Verification

```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Verify contracts on Celo Explorer for transparency.

### Frontend Deployment

#### 1. Web PWA Deployment

```bash
# Build for production
npm run build:web

# Deploy to hosting service
# Upload the 'dist' folder to your hosting provider
```

#### 2. Mobile App Deployment

For mobile deployment:

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

#### 3. Environment Configuration

Update environment variables for production:
- Contract addresses
- RPC URLs
- API endpoints

## 🏗️ Infrastructure Setup

### Hosting Options

#### Web Hosting
- **Vercel**: Easy deployment with automatic builds
- **Netlify**: Great for static sites with form handling
- **AWS S3 + CloudFront**: Scalable and cost-effective
- **Firebase Hosting**: Google's hosting solution

#### Mobile App Stores
- **Google Play Store**: For Android distribution
- **Apple App Store**: For iOS distribution
- **Expo Application Services**: Managed app distribution

### Database Setup

For production, consider:
- **Supabase**: PostgreSQL with real-time features
- **Firebase**: NoSQL database with authentication
- **AWS RDS**: Managed PostgreSQL
- **MongoDB Atlas**: NoSQL cloud database

### CDN Configuration

- **Cloudflare**: Global CDN with security features
- **AWS CloudFront**: Amazon's CDN service
- **KeyCDN**: High-performance CDN

## 🔒 Security Considerations

### Smart Contract Security

1. **Audit Requirements**:
   - Professional security audit
   - Code review by multiple developers
   - Test coverage > 90%

2. **Access Controls**:
   - Multi-signature wallets for admin functions
   - Time-locked upgrades
   - Emergency pause functionality

3. **Upgrade Strategy**:
   - Proxy patterns for upgradeable contracts
   - Migration scripts for data
   - Backward compatibility

### Frontend Security

1. **Environment Variables**:
   - Never commit private keys
   - Use environment-specific configs
   - Rotate keys regularly

2. **API Security**:
   - Rate limiting
   - Input validation
   - CORS configuration

3. **Wallet Security**:
   - Secure key storage
   - Transaction signing
   - Phishing protection

## 📊 Monitoring and Analytics

### Smart Contract Monitoring

1. **Event Tracking**:
   - Reward distributions
   - NFT minting
   - Admin actions

2. **Error Monitoring**:
   - Failed transactions
   - Contract errors
   - Gas limit issues

3. **Performance Metrics**:
   - Transaction costs
   - Block confirmation times
   - Network congestion

### Application Monitoring

1. **User Analytics**:
   - Gameplay metrics
   - User retention
   - Feature usage

2. **Performance Monitoring**:
   - Page load times
   - API response times
   - Error rates

3. **Business Metrics**:
   - Daily active users
   - Revenue tracking
   - Conversion rates

## 🚨 Troubleshooting

### Common Issues

#### Contract Deployment Fails
```bash
# Check gas limit
npx hardhat run scripts/deploy.js --network alfajores --gas-limit 8000000

# Verify network connection
npx hardhat console --network alfajores
```

#### Frontend Build Errors
```bash
# Clear cache
npm run clean
rm -rf node_modules
npm install

# Check TypeScript errors
npm run type-check
```

#### Wallet Connection Issues
- Verify network configuration
- Check RPC endpoint availability
- Ensure wallet is unlocked

### Support Resources

- **Celo Documentation**: https://docs.celo.org/
- **Hardhat Documentation**: https://hardhat.org/docs
- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/docs

## 🔄 Maintenance

### Regular Tasks

1. **Weekly**:
   - Monitor contract balances
   - Check error logs
   - Update dependencies

2. **Monthly**:
   - Security updates
   - Performance optimization
   - User feedback review

3. **Quarterly**:
   - Security audit
   - Feature planning
   - Infrastructure review

### Backup Strategy

1. **Smart Contracts**:
   - Source code versioning
   - Deployment scripts
   - Configuration files

2. **Frontend**:
   - Code repository
   - Build artifacts
   - Environment configs

3. **Data**:
   - User progress
   - Leaderboard data
   - Analytics data

## 📈 Scaling Considerations

### Smart Contract Scaling

- **Layer 2 Solutions**: Consider Celo's L2 options
- **Batch Operations**: Group multiple operations
- **Gas Optimization**: Minimize transaction costs

### Frontend Scaling

- **CDN**: Global content delivery
- **Caching**: Reduce server load
- **Load Balancing**: Distribute traffic

### Database Scaling

- **Read Replicas**: Improve read performance
- **Sharding**: Distribute data
- **Caching**: Reduce database load

## 🎯 Production Checklist

Before going live:

- [ ] Smart contracts audited
- [ ] All tests passing
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team training completed
- [ ] Rollback plan ready
- [ ] Support channels established

## 📞 Support

For deployment issues:
- Check the troubleshooting section
- Review logs and error messages
- Contact the development team
- Join the community Discord

Remember: Always test thoroughly on testnet before considering mainnet deployment!
