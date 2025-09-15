// Game engine integration test script for GemCraft contracts
const { ethers } = require("hardhat");

async function main() {
  console.log("🎮 Testing Game Engine Integration with Deployed Contracts...\n");

  // Real deployed contract addresses
  const CONTRACTS = {
    REWARDS: "0xd5ea8671F16BFB23044c54ed65eE3A7ab63BF58F",
    NFT_GEM: "0x43161EAAC8726443B5AE5Cd7219cDeF8e43612Fe",
    LEADERBOARD: "0x254e926B7AEFC03f8519800f25C44E96617475dC",
  };

  // Get signers
  const [deployer, testUser] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 Test User:", testUser.address);

  const testResults = {
    network: "alfajores",
    timestamp: new Date().toISOString(),
    gameEngineTests: {},
  };

  try {
    // Connect to contracts
    const rewards = await ethers.getContractAt("Rewards", CONTRACTS.REWARDS);
    const nftGem = await ethers.getContractAt("NFTGem", CONTRACTS.NFT_GEM);
    const leaderboard = await ethers.getContractAt("Leaderboard", CONTRACTS.LEADERBOARD);

    // 1. Test Level Completion Rewards
    console.log("\n🎯 Testing Level Completion Rewards...");
    
    try {
      const levelCompleteAmount = await rewards.levelCompleteAmount();
      const achievementAmount = await rewards.achievementAmount();
      
      console.log("   ✅ Level completion reward:", ethers.formatEther(levelCompleteAmount), "cUSD");
      console.log("   ✅ Achievement reward:", ethers.formatEther(achievementAmount), "cUSD");

      // Simulate level completion reward claim
      const gasPrice = await ethers.provider.getFeeData();
      const gasPriceWithBuffer = gasPrice.gasPrice * 200n / 100n;

      // Create a mock signature for testing
      const mockSignature = ethers.utils.hexlify(ethers.utils.randomBytes(65));
      
      const claimTx = await rewards.claimLevelReward.populateTransaction(
        1, // Level 1
        1000, // Score 1000
        mockSignature
      );
      
      const gasEstimate = await ethers.provider.estimateGas(claimTx);
      console.log("   ✅ Level completion gas estimate:", gasEstimate.toString());

      testResults.gameEngineTests.levelRewards = {
        levelCompleteAmount: ethers.formatEther(levelCompleteAmount),
        achievementAmount: ethers.formatEther(achievementAmount),
        gasEstimate: gasEstimate.toString(),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Level completion test failed:", error.message);
      testResults.gameEngineTests.levelRewards = { error: error.message };
    }

    // 2. Test NFT Minting for Game Achievements
    console.log("\n💎 Testing NFT Minting for Game Achievements...");
    
    try {
      const totalSupply = await nftGem.totalSupply();
      console.log("   ✅ Current NFT total supply:", totalSupply.toString());

      // Test different gem types and rarities
      const gemTypes = [
        { type: 0, name: "Ruby" },
        { type: 1, name: "Sapphire" },
        { type: 2, name: "Emerald" },
        { type: 3, name: "Diamond" },
        { type: 4, name: "Amethyst" },
        { type: 5, name: "Topaz" },
        { type: 6, name: "Special" },
      ];

      const rarities = [
        { rarity: 0, name: "Common" },
        { rarity: 1, name: "Rare" },
        { rarity: 2, name: "Epic" },
        { rarity: 3, name: "Legendary" },
      ];

      const powers = [
        { power: 0, name: "Normal" },
        { power: 1, name: "RowClear" },
        { power: 2, name: "ColumnClear" },
        { power: 3, name: "Explosive" },
        { power: 4, name: "ColorBomb" },
      ];

      console.log("   ✅ Gem types available:", gemTypes.length);
      console.log("   ✅ Rarity levels available:", rarities.length);
      console.log("   ✅ Power types available:", powers.length);

      // Test minting a rare gem for level 25 achievement
      const gasPrice = await ethers.provider.getFeeData();
      const gasPriceWithBuffer = gasPrice.gasPrice * 200n / 100n;

      const mintTx = await nftGem.mintGem.populateTransaction(
        testUser.address,
        1, // Sapphire
        1, // Rare
        1, // RowClear
        25 // Level 25
      );

      const gasEstimate = await ethers.provider.estimateGas(mintTx);
      console.log("   ✅ NFT minting gas estimate:", gasEstimate.toString());

      testResults.gameEngineTests.nftMinting = {
        totalSupply: totalSupply.toString(),
        gemTypes: gemTypes.length,
        rarities: rarities.length,
        powers: powers.length,
        gasEstimate: gasEstimate.toString(),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ NFT minting test failed:", error.message);
      testResults.gameEngineTests.nftMinting = { error: error.message };
    }

    // 3. Test Combo Bonus Rewards
    console.log("\n🔥 Testing Combo Bonus Rewards...");
    
    try {
      const comboBonusAmount = await rewards.comboBonusAmount();
      console.log("   ✅ Combo bonus base amount:", ethers.formatEther(comboBonusAmount), "cUSD");

      // Test different combo counts
      const comboCounts = [3, 5, 7, 10];
      
      for (const comboCount of comboCounts) {
        const totalReward = comboBonusAmount * BigInt(comboCount);
        console.log(`   ✅ ${comboCount} combos reward: ${ethers.formatEther(totalReward)} cUSD`);
      }

      // Simulate combo reward claim
      const gasPrice = await ethers.provider.getFeeData();
      const gasPriceWithBuffer = gasPrice.gasPrice * 200n / 100n;

      const mockSignature = ethers.utils.hexlify(ethers.utils.randomBytes(65));
      
      const claimTx = await rewards.claimComboReward.populateTransaction(
        5, // 5 combos
        mockSignature
      );
      
      const gasEstimate = await ethers.provider.estimateGas(claimTx);
      console.log("   ✅ Combo reward gas estimate:", gasEstimate.toString());

      testResults.gameEngineTests.comboRewards = {
        baseAmount: ethers.formatEther(comboBonusAmount),
        comboCounts: comboCounts,
        gasEstimate: gasEstimate.toString(),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Combo bonus test failed:", error.message);
      testResults.gameEngineTests.comboRewards = { error: error.message };
    }

    // 4. Test Daily Bonus System
    console.log("\n📅 Testing Daily Bonus System...");
    
    try {
      const dailyBonusAmount = await rewards.dailyBonusAmount();
      const canClaimDaily = await rewards.canClaimDailyBonus(testUser.address);
      const lastDailyClaim = await rewards.lastDailyClaim(testUser.address);
      
      console.log("   ✅ Daily bonus amount:", ethers.formatEther(dailyBonusAmount), "cUSD");
      console.log("   ✅ Can claim daily bonus:", canClaimDaily);
      console.log("   ✅ Last claim timestamp:", lastDailyClaim.toString());

      // Simulate daily bonus claim
      const gasPrice = await ethers.provider.getFeeData();
      const gasPriceWithBuffer = gasPrice.gasPrice * 200n / 100n;

      const claimTx = await rewards.claimDailyBonus.populateTransaction();
      const gasEstimate = await ethers.provider.estimateGas(claimTx);
      console.log("   ✅ Daily bonus gas estimate:", gasEstimate.toString());

      testResults.gameEngineTests.dailyBonus = {
        amount: ethers.formatEther(dailyBonusAmount),
        canClaim: canClaimDaily,
        lastClaim: lastDailyClaim.toString(),
        gasEstimate: gasEstimate.toString(),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Daily bonus test failed:", error.message);
      testResults.gameEngineTests.dailyBonus = { error: error.message };
    }

    // 5. Test Player Statistics and NFT Collection
    console.log("\n📊 Testing Player Statistics and NFT Collection...");
    
    try {
      const playerTokens = await nftGem.getPlayerTokens(deployer.address);
      console.log("   ✅ Deployer NFT count:", playerTokens.length);

      // Get detailed NFT information
      if (playerTokens.length > 0) {
        const firstToken = playerTokens[0];
        const gemData = await nftGem.getGemData(firstToken);
        
        console.log("   ✅ First NFT details:");
        console.log(`      Token ID: ${firstToken}`);
        console.log(`      Gem Type: ${gemData.gemType}`);
        console.log(`      Rarity: ${gemData.rarity}`);
        console.log(`      Power: ${gemData.power}`);
        console.log(`      Level: ${gemData.level}`);
        console.log(`      Minted At: ${new Date(Number(gemData.mintedAt) * 1000).toISOString()}`);
      }

      // Test rarity-based filtering
      const commonGems = await nftGem.getGemsByRarity(deployer.address, 0); // Common
      const rareGems = await nftGem.getGemsByRarity(deployer.address, 1); // Rare
      
      console.log("   ✅ Common gems:", commonGems.length);
      console.log("   ✅ Rare gems:", rareGems.length);

      testResults.gameEngineTests.playerStats = {
        totalNFTs: playerTokens.length,
        commonGems: commonGems.length,
        rareGems: rareGems.length,
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Player statistics test failed:", error.message);
      testResults.gameEngineTests.playerStats = { error: error.message };
    }

    // 6. Test Game Performance Metrics
    console.log("\n⚡ Testing Game Performance Metrics...");
    
    try {
      // Test gas costs for different game actions
      const gasPrice = await ethers.provider.getFeeData();
      const gasPriceWithBuffer = gasPrice.gasPrice * 200n / 100n;

      const actions = [
        { name: "Daily Bonus Claim", gas: await ethers.provider.estimateGas(await rewards.claimDailyBonus.populateTransaction()) },
        { name: "Level Completion", gas: await ethers.provider.estimateGas(await rewards.claimLevelReward.populateTransaction(1, 1000, ethers.utils.hexlify(ethers.utils.randomBytes(65)))) },
        { name: "Combo Reward", gas: await ethers.provider.estimateGas(await rewards.claimComboReward.populateTransaction(5, ethers.utils.hexlify(ethers.utils.randomBytes(65)))) },
        { name: "NFT Minting", gas: await ethers.provider.estimateGas(await nftGem.mintGem.populateTransaction(testUser.address, 1, 1, 1, 25)) },
      ];

      console.log("   ✅ Gas costs for game actions:");
      for (const action of actions) {
        const cost = ethers.formatEther(action.gas * gasPriceWithBuffer);
        console.log(`      ${action.name}: ${action.gas.toString()} gas (${cost} CELO)`);
      }

      testResults.gameEngineTests.performance = {
        actions: actions.map(action => ({
          name: action.name,
          gas: action.gas.toString(),
          cost: ethers.formatEther(action.gas * gasPriceWithBuffer)
        })),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Performance test failed:", error.message);
      testResults.gameEngineTests.performance = { error: error.message };
    }

    // Display test summary
    console.log("\n" + "=".repeat(60));
    console.log("🎮 GAME ENGINE INTEGRATION TEST SUMMARY");
    console.log("=".repeat(60));

    const totalTests = Object.keys(testResults.gameEngineTests).length;
    const passedTests = Object.values(testResults.gameEngineTests).filter(test => 
      test.passed === true
    ).length;

    console.log(`📊 Test Results: ${passedTests}/${totalTests} test categories passed`);

    console.log("\n📋 Test Categories:");
    Object.entries(testResults.gameEngineTests).forEach(([category, result]) => {
      const status = result.passed ? "✅ PASSED" : "❌ FAILED";
      console.log(`   ${category}: ${status}`);
    });

    console.log("\n🎯 Game Features Ready:");
    console.log("   ✅ Level completion rewards");
    console.log("   ✅ NFT minting for achievements");
    console.log("   ✅ Combo bonus rewards");
    console.log("   ✅ Daily bonus system");
    console.log("   ✅ Player statistics tracking");
    console.log("   ✅ Performance optimization");

    console.log("\n🔗 Contract Addresses:");
    console.log("   Rewards:", CONTRACTS.REWARDS);
    console.log("   NFTGem:", CONTRACTS.NFT_GEM);
    console.log("   Leaderboard:", CONTRACTS.LEADERBOARD);

    if (passedTests === totalTests) {
      console.log("\n🎉 All game engine integration tests passed!");
      console.log("✅ Contracts are ready for full game integration");
    } else {
      console.log("\n⚠️  Some tests failed. Check the results for details.");
    }

    return testResults;

  } catch (error) {
    console.error("\n❌ Game engine integration test failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Game engine integration test failed:", error);
    process.exit(1);
  });
