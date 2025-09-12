# GemCraft - Match-3 Puzzle Game on Celo

A modern jewel-gem match-3 puzzle game built with React Native for mobile and Progressive Web App (PWA) for web, integrated with Celo blockchain for rewards and NFTs.

## 🎮 Game Features

- **Match-3 Mechanics**: Swap adjacent gems to form lines of 3+ same-type gems
- **Cascades & Combos**: Chain reactions and combo multipliers
- **Power-ups**: Row/column clears, explosive gems, color bombs
- **Levels**: Progressive difficulty with various objectives
- **Blockchain Integration**: Celo Alfajores testnet for rewards and NFTs
- **Cross-Platform**: React Native for mobile, PWA for web

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- For mobile development: Expo Go app or development build

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gemcraft
```

2. Install dependencies:
```bash
npm install
```

3. Install contract dependencies:
```bash
cd contracts
npm install
cd ..
```

4. Start the development server:
```bash
npm start
```

### Running on Different Platforms

- **Web**: `npm run web` or press `w` in the Expo CLI
- **iOS**: `npm run ios` or press `i` in the Expo CLI
- **Android**: `npm run android` or press `a` in the Expo CLI

## 🏗️ Project Structure

```
gemcraft/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── game/               # Game engine and logic
│   ├── store/              # State management
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── assets/             # Images, sounds, etc.
├── contracts/              # Solidity smart contracts
│   ├── contracts/          # Contract source files
│   ├── scripts/            # Deployment scripts
│   ├── test/               # Contract tests
│   └── hardhat.config.js   # Hardhat configuration
├── public/                 # PWA assets
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── index.html         # HTML template
├── assets/                 # Expo assets
└── docs/                   # Documentation
```

## 🔗 Celo Integration

### Alfajores Testnet Configuration

The game is configured to work with Celo Alfajores testnet:

- **RPC URL**: `https://alfajores-forno.celo-testnet.org`
- **Chain ID**: `44787`
- **Explorer**: `https://explorer.celo.org/alfajores`

### Smart Contracts

- **Rewards.sol**: Handles token rewards for achievements
- **NFTGem.sol**: ERC-721 NFTs for rare gems and power-ups
- **Leaderboard.sol**: On-chain leaderboard storage

### Wallet Support

- Celo Wallet
- MetaMask (configured for Alfajores)
- WalletConnect v2

## 🎯 Game Engine

The game uses a shared TypeScript engine that works on both React Native and web:

- **Match Detection**: Flood-fill algorithm for finding matches
- **Power-ups**: 4+ matches, L/T shapes, 5-in-a-row color bombs
- **Animations**: Smooth transitions using react-native-reanimated
- **State Management**: Zustand for game state

## 🛠️ Development

### Game Development

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Smart Contract Development

```bash
# Compile contracts
npm run hardhat:compile

# Run tests
npm run hardhat:test

# Deploy to Alfajores
npm run hardhat:deploy:alfajores

# Verify contracts
npm run hardhat:verify
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Celo Alfajores Configuration
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
ALFAJORES_CHAIN_ID=44787
ALFAJORES_EXPLORER_URL=https://explorer.celo.org/alfajores

# Contract Addresses (after deployment)
REWARDS_CONTRACT_ADDRESS=
NFT_GEM_CONTRACT_ADDRESS=
LEADERBOARD_CONTRACT_ADDRESS=

# Private Key for deployment (TEST ONLY)
PRIVATE_KEY=your_test_private_key_here

# Test Token Addresses
TEST_CUSD_ADDRESS=
TEST_CELO_ADDRESS=
```

## 📱 PWA Features

The web version includes PWA capabilities:

- **Offline Play**: Full single-player experience offline
- **Install Prompt**: Add to home screen
- **Service Worker**: Caching for performance
- **Responsive Design**: Works on desktop and mobile

## 🎨 Customization

### Adding New Gem Types

1. Update the gem types in `src/game/types.ts`
2. Add gem assets to `src/assets/gems/`
3. Update the game engine logic in `src/game/engine.ts`

### Modifying Rewards

1. Update the rewards contract in `contracts/contracts/Rewards.sol`
2. Modify the reward amounts in the admin dashboard
3. Update the frontend integration in `src/utils/blockchain.ts`

## 🧪 Testing

### Game Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```

### Contract Testing

```bash
# Run contract tests
npm run hardhat:test

# Run with gas reporting
npm run hardhat:test -- --gas-report
```

## 🚀 Deployment

### Web Deployment

```bash
# Build for web
npm run build:web

# Deploy to your hosting service
# The build output will be in the 'dist' folder
```

### Contract Deployment

1. Get test CELO from the Alfajores faucet
2. Set your private key in the environment
3. Deploy contracts:

```bash
npm run hardhat:deploy:alfajores
```

4. Verify contracts on the explorer:

```bash
npm run hardhat:verify
```

## 🔒 Security

- **Testnet Only**: This implementation is for Alfajores testnet only
- **Private Keys**: Never use production keys on testnets
- **Audits**: Conduct thorough testing before mainnet deployment
- **Multisig**: Use multisig wallets for production deployments

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions and support:

- Create an issue in the repository
- Join our Discord community
- Check the documentation in the `docs/` folder

## 🗺️ Roadmap

- [ ] Mainnet deployment after testing
- [ ] Additional game modes
- [ ] Social features
- [ ] Tournament system
- [ ] Mobile app store releases

---

**⚠️ Important**: This is a testnet implementation. Do not use real funds or production keys. Always test thoroughly before considering mainnet deployment.

## 🎮 How to Play

1. **Connect Wallet**: Connect your Celo wallet to start earning rewards
2. **Select Level**: Choose from available levels with different objectives
3. **Match Gems**: Swap adjacent gems to create matches of 3 or more
4. **Create Combos**: Chain matches for higher scores and rewards
5. **Use Power-ups**: Special gems provide powerful effects
6. **Earn Rewards**: Complete levels to earn test tokens and NFTs
7. **Compete**: Climb the leaderboard and show your skills

## 💰 Reward System

- **Daily Bonus**: 1 cUSD for daily login
- **Level Complete**: 0.5 cUSD for completing levels
- **Achievements**: 2 cUSD for special achievements
- **Combo Bonus**: 0.1 cUSD per combo in a chain
- **NFT Gems**: Rare gems as collectible NFTs

## 🔧 Admin Features

The admin dashboard allows you to:
- Monitor system statistics
- Configure reward amounts
- Manage NFT drop rates
- Fund/withdraw from contracts
- Pause/resume the system
- View contract addresses

Access the admin dashboard at `/admin` (requires admin privileges).

## 🌐 Network Information

- **Network**: Celo Alfajores Testnet
- **Chain ID**: 44787
- **RPC**: https://alfajores-forno.celo-testnet.org
- **Explorer**: https://explorer.celo.org/alfajores
- **Faucet**: https://faucet.celo.org/

## 📊 Performance

- **Game Engine**: Optimized for 60fps gameplay
- **PWA**: Offline-first architecture
- **Caching**: Intelligent service worker caching
- **Responsive**: Works on all screen sizes
- **Cross-platform**: Native performance on mobile and web
