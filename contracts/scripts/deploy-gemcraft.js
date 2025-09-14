// Enhanced GemCraft deployment script for Celo Alfajores
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting GemCraft deployment to Celo Alfajores...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "CELO");
  
  if (balance < ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low balance! Consider getting test CELO from faucet:");
    console.log("   https://faucet.celo.org/");
  }

  // Celo Alfajores testnet token addresses (verified)
  const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  // CELO is the native token on Celo, so we use the zero address for it
  const CELO_ADDRESS = "0x0000000000000000000000000000000000000000";

  console.log("\n📋 Using token addresses:");
  console.log("   cUSD:", CUSD_ADDRESS);
  console.log("   CELO:", CELO_ADDRESS);

  let deploymentInfo = {
    network: "alfajores",
    deployer: deployer.address,
    deployerBalance: ethers.formatEther(balance),
    contracts: {},
    timestamp: new Date().toISOString(),
    blockNumber: 0,
    gasUsed: {},
    transactionHashes: {},
  };

  try {
  // 1. Deploy Rewards Contract
  console.log("\n🎯 Deploying Rewards contract...");
  const Rewards = await ethers.getContractFactory("Rewards");
  
  // Get current gas price and add some buffer
  const gasPrice = await ethers.provider.getFeeData();
  const gasPriceWithBuffer = gasPrice.gasPrice * 120n / 100n; // 20% buffer
  
  const rewards = await Rewards.deploy(CUSD_ADDRESS, CELO_ADDRESS, {
    gasPrice: gasPriceWithBuffer
  });
  await rewards.waitForDeployment();
  const rewardsAddress = await rewards.getAddress();
  console.log("✅ Rewards contract deployed to:", rewardsAddress);

  deploymentInfo.contracts.rewards = {
    address: rewardsAddress,
    cUSD: CUSD_ADDRESS,
    CELO: CELO_ADDRESS,
  };

  // 2. Deploy NFTGem Contract
  console.log("\n💎 Deploying NFTGem contract...");
  const NFTGem = await ethers.getContractFactory("NFTGem");
  const baseURI = "https://api.gemcraft.celo.org/metadata/";
  const nftGem = await NFTGem.deploy(baseURI, {
    gasPrice: gasPriceWithBuffer
  });
  await nftGem.waitForDeployment();
  const nftGemAddress = await nftGem.getAddress();
  console.log("✅ NFTGem contract deployed to:", nftGemAddress);

  deploymentInfo.contracts.nftGem = {
    address: nftGemAddress,
    baseURI: baseURI,
  };

    // 3. Deploy Leaderboard Contract (if exists)
    try {
      console.log("\n🏆 Deploying Leaderboard contract...");
      const Leaderboard = await ethers.getContractFactory("Leaderboard");
      const leaderboard = await Leaderboard.deploy({
        gasPrice: gasPriceWithBuffer
      });
      await leaderboard.waitForDeployment();
      const leaderboardAddress = await leaderboard.getAddress();
      console.log("✅ Leaderboard contract deployed to:", leaderboardAddress);

      deploymentInfo.contracts.leaderboard = {
        address: leaderboardAddress,
      };
    } catch (error) {
      console.log("⚠️  Leaderboard contract not found, skipping...");
    }

    // 4. Initialize contracts with initial funding
    console.log("\n💰 Initializing contracts...");
    
    // Fund Rewards contract with test cUSD (if we have some)
    try {
      const cUSD = await ethers.getContractAt("IERC20", CUSD_ADDRESS);
      const cUSDBalance = await cUSD.balanceOf(deployer.address);
      
      if (cUSDBalance > 0) {
        const fundingAmount = cUSDBalance / 2n; // Use half of available cUSD
        console.log(`   Funding Rewards contract with ${ethers.formatEther(fundingAmount)} cUSD...`);
        
        const fundTx = await cUSD.transfer(rewards.address, fundingAmount);
        await fundTx.wait();
        console.log("✅ Rewards contract funded successfully");
      } else {
        console.log("⚠️  No cUSD balance to fund contracts. Get test tokens from faucet:");
        console.log("   https://faucet.celo.org/");
      }
    } catch (error) {
      console.log("⚠️  Could not fund contracts:", error.message);
    }

    // 5. Set up contract permissions and initial configuration
    console.log("\n⚙️  Configuring contracts...");
    
    // Update reward amounts for the 100-level system
    const rewardAmounts = {
      dailyBonus: ethers.parseEther("0.1"), // 0.1 cUSD
      levelComplete: ethers.parseEther("0.5"), // 0.5 cUSD
      achievement: ethers.parseEther("2.0"), // 2 cUSD
      comboBonus: ethers.parseEther("0.1"), // 0.1 cUSD
    };

    console.log("   Setting reward amounts...");
    await rewards.updateRewardAmount("daily_bonus", rewardAmounts.dailyBonus);
    await rewards.updateRewardAmount("level_complete", rewardAmounts.levelComplete);
    await rewards.updateRewardAmount("achievement", rewardAmounts.achievement);
    await rewards.updateRewardAmount("combo_bonus", rewardAmounts.comboBonus);
    console.log("✅ Reward amounts configured");

    // 6. Mint initial test NFTs
    console.log("\n🎨 Minting initial test NFTs...");
    try {
      // Mint a few test gems for the deployer
      const testGems = [
        { type: 0, rarity: 0, power: 0, level: 1 }, // Common Ruby
        { type: 1, rarity: 1, power: 1, level: 5 }, // Rare Sapphire
        { type: 2, rarity: 2, power: 2, level: 10 }, // Epic Emerald
      ];

      for (const gem of testGems) {
        const mintTx = await nftGem.mintGem(
          deployer.address,
          gem.type,
          gem.rarity,
          gem.power,
          gem.level
        );
        await mintTx.wait();
      }
      console.log("✅ Test NFTs minted successfully");
    } catch (error) {
      console.log("⚠️  Could not mint test NFTs:", error.message);
    }

    // 7. Get final block number
    deploymentInfo.blockNumber = await ethers.provider.getBlockNumber();

    // 8. Save deployment info
    const deploymentPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    const fileName = `gemcraft-alfajores-${Date.now()}.json`;
    const filePath = path.join(deploymentPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));

    // 9. Display deployment summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 GEMCRAFT DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("📊 Deployment Summary:");
    console.log("   Network: Celo Alfajores Testnet");
    console.log("   Deployer:", deployer.address);
    console.log("   Block Number:", deploymentInfo.blockNumber);
    console.log("   Timestamp:", deploymentInfo.timestamp);
    
    console.log("\n📋 Contract Addresses:");
    console.log("   Rewards:", deploymentInfo.contracts.rewards.address);
    console.log("   NFTGem:", deploymentInfo.contracts.nftGem.address);
    if (deploymentInfo.contracts.leaderboard) {
      console.log("   Leaderboard:", deploymentInfo.contracts.leaderboard.address);
    }

    console.log("\n🔗 Explorer Links:");
    console.log("   Rewards:", `https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.rewards.address}`);
    console.log("   NFTGem:", `https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.nftGem.address}`);
    if (deploymentInfo.contracts.leaderboard) {
      console.log("   Leaderboard:", `https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.leaderboard.address}`);
    }

    console.log("\n📝 Next Steps:");
    console.log("1. Update your .env file with contract addresses:");
    console.log(`   REWARDS_CONTRACT_ADDRESS=${deploymentInfo.contracts.rewards.address}`);
    console.log(`   NFT_GEM_CONTRACT_ADDRESS=${deploymentInfo.contracts.nftGem.address}`);
    if (deploymentInfo.contracts.leaderboard) {
      console.log(`   LEADERBOARD_CONTRACT_ADDRESS=${deploymentInfo.contracts.leaderboard.address}`);
    }

    console.log("\n2. Fund contracts with test tokens:");
    console.log(`   - Send test cUSD to Rewards: ${deploymentInfo.contracts.rewards.address}`);
    console.log("   - Use Alfajores faucet: https://faucet.celo.org/");

    console.log("\n3. Verify contracts on Celo Explorer:");
    console.log(`   npx hardhat verify --network alfajores ${deploymentInfo.contracts.rewards.address} "${CUSD_ADDRESS}" "${CELO_ADDRESS}"`);
    console.log(`   npx hardhat verify --network alfajores ${deploymentInfo.contracts.nftGem.address} "${baseURI}"`);
    if (deploymentInfo.contracts.leaderboard) {
      console.log(`   npx hardhat verify --network alfajores ${deploymentInfo.contracts.leaderboard.address}`);
    }

    console.log("\n4. Test the contracts:");
    console.log("   - Try claiming daily bonus");
    console.log("   - Mint test NFTs");
    console.log("   - Check balances and transactions");

    console.log(`\n💾 Deployment info saved to: ${filePath}`);
    console.log("\n🎮 Ready to play GemCraft on Celo!");

  return deploymentInfo;

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    
    // Save error info
    const errorInfo = {
      ...deploymentInfo,
      error: error.message,
      stack: error.stack,
    };
    
    const errorPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(errorPath)) {
      fs.mkdirSync(errorPath, { recursive: true });
    }
    
    const errorFileName = `deployment-error-${Date.now()}.json`;
    const errorFilePath = path.join(errorPath, errorFileName);
    fs.writeFileSync(errorFilePath, JSON.stringify(errorInfo, null, 2));
    
    console.log(`💾 Error info saved to: ${errorFilePath}`);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  });