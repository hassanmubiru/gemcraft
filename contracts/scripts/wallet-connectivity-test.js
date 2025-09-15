// Wallet connectivity test script for deployed GemCraft contracts
const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 Testing Wallet Connectivity with Deployed Contracts...\n");

  // Real deployed contract addresses
  const CONTRACTS = {
    REWARDS: "0xd5ea8671F16BFB23044c54ed65eE3A7ab63BF58F",
    NFT_GEM: "0x43161EAAC8726443B5AE5Cd7219cDeF8e43612Fe",
    LEADERBOARD: "0x254e926B7AEFC03f8519800f25C44E96617475dC",
  };

  const TOKENS = {
    CUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    CELO: "0x0000000000000000000000000000000000000000", // Native token
  };

  // Get signers
  const [deployer, testUser] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 Test User:", testUser.address);

  const testResults = {
    network: "alfajores",
    timestamp: new Date().toISOString(),
    walletTests: {},
    contractTests: {},
  };

  try {
    // 1. Test Wallet Connection
    console.log("\n🔗 Testing Wallet Connection...");
    
    const walletTests = {
      deployerBalance: await ethers.provider.getBalance(deployer.address),
      testUserBalance: await ethers.provider.getBalance(testUser.address),
      networkId: await ethers.provider.getNetwork(),
      gasPrice: await ethers.provider.getFeeData(),
    };

    console.log("   ✅ Deployer balance:", ethers.formatEther(walletTests.deployerBalance), "CELO");
    console.log("   ✅ Test user balance:", ethers.formatEther(walletTests.testUserBalance), "CELO");
    console.log("   ✅ Network ID:", walletTests.networkId.chainId.toString());
    console.log("   ✅ Gas price:", ethers.formatUnits(walletTests.gasPrice.gasPrice, "gwei"), "gwei");

    testResults.walletTests = {
      deployerBalance: ethers.formatEther(walletTests.deployerBalance),
      testUserBalance: ethers.formatEther(walletTests.testUserBalance),
      networkId: walletTests.networkId.chainId.toString(),
      gasPrice: ethers.formatUnits(walletTests.gasPrice.gasPrice, "gwei"),
      passed: true,
    };

    // 2. Test Contract Connectivity
    console.log("\n📋 Testing Contract Connectivity...");
    
    const rewards = await ethers.getContractAt("Rewards", CONTRACTS.REWARDS);
    const nftGem = await ethers.getContractAt("NFTGem", CONTRACTS.NFT_GEM);
    const leaderboard = await ethers.getContractAt("Leaderboard", CONTRACTS.LEADERBOARD);

    console.log("   ✅ Rewards contract connected");
    console.log("   ✅ NFTGem contract connected");
    console.log("   ✅ Leaderboard contract connected");

    // 3. Test Contract Functions
    console.log("\n🎯 Testing Contract Functions...");
    
    const contractTests = {};

    // Test Rewards contract functions
    try {
      const owner = await rewards.owner();
      const dailyBonus = await rewards.dailyBonusAmount();
      const canClaim = await rewards.canClaimDailyBonus(testUser.address);
      
      console.log("   ✅ Rewards owner:", owner);
      console.log("   ✅ Daily bonus amount:", ethers.formatEther(dailyBonus), "cUSD");
      console.log("   ✅ Can claim daily bonus:", canClaim);

      contractTests.rewards = {
        owner: owner,
        dailyBonus: ethers.formatEther(dailyBonus),
        canClaimDaily: canClaim,
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Rewards contract test failed:", error.message);
      contractTests.rewards = { error: error.message };
    }

    // Test NFTGem contract functions
    try {
      const owner = await nftGem.owner();
      const totalSupply = await nftGem.totalSupply();
      const deployerTokens = await nftGem.getPlayerTokens(deployer.address);
      
      console.log("   ✅ NFTGem owner:", owner);
      console.log("   ✅ Total supply:", totalSupply.toString());
      console.log("   ✅ Deployer tokens:", deployerTokens.length);

      contractTests.nftGem = {
        owner: owner,
        totalSupply: totalSupply.toString(),
        deployerTokens: deployerTokens.length,
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ NFTGem contract test failed:", error.message);
      contractTests.nftGem = { error: error.message };
    }

    // Test Leaderboard contract functions
    try {
      const owner = await leaderboard.owner();
      
      console.log("   ✅ Leaderboard owner:", owner);

      contractTests.leaderboard = {
        owner: owner,
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Leaderboard contract test failed:", error.message);
      contractTests.leaderboard = { error: error.message };
    }

    testResults.contractTests = contractTests;

    // 4. Test Token Interactions
    console.log("\n💰 Testing Token Interactions...");
    
    try {
      const cUSD = await ethers.getContractAt("IERC20", TOKENS.CUSD);
      const cUSDBalance = await cUSD.balanceOf(deployer.address);
      const rewardsBalance = await cUSD.balanceOf(CONTRACTS.REWARDS);
      
      console.log("   ✅ Deployer cUSD balance:", ethers.formatEther(cUSDBalance), "cUSD");
      console.log("   ✅ Rewards contract cUSD balance:", ethers.formatEther(rewardsBalance), "cUSD");

      testResults.tokenTests = {
        deployerCUSDBalance: ethers.formatEther(cUSDBalance),
        rewardsCUSDBalance: ethers.formatEther(rewardsBalance),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Token interaction test failed:", error.message);
      testResults.tokenTests = { error: error.message };
    }

    // 5. Test Game-Specific Functions
    console.log("\n🎮 Testing Game-Specific Functions...");
    
    try {
      // Test daily bonus claim simulation
      const canClaimDaily = await rewards.canClaimDailyBonus(testUser.address);
      console.log("   ✅ Daily bonus claim available:", canClaimDaily);

      // Test NFT minting simulation
      const mintPrice = await nftGem.getMintPrice(1); // Rare
      console.log("   ✅ Rare NFT mint price:", ethers.formatEther(mintPrice), "cUSD");

      // Test player token retrieval
      const playerTokens = await nftGem.getPlayerTokens(deployer.address);
      console.log("   ✅ Player has", playerTokens.length, "NFTs");

      testResults.gameTests = {
        canClaimDaily: canClaimDaily,
        rareMintPrice: ethers.formatEther(mintPrice),
        playerTokenCount: playerTokens.length,
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Game function test failed:", error.message);
      testResults.gameTests = { error: error.message };
    }

    // 6. Test Transaction Simulation
    console.log("\n🔄 Testing Transaction Simulation...");
    
    try {
      const gasPrice = await ethers.provider.getFeeData();
      const gasPriceWithBuffer = gasPrice.gasPrice * 200n / 100n;

      // Simulate a daily bonus claim (without actually claiming)
      const claimTx = await rewards.claimDailyBonus.populateTransaction();
      const gasEstimate = await ethers.provider.estimateGas(claimTx);
      
      console.log("   ✅ Daily bonus claim gas estimate:", gasEstimate.toString());
      console.log("   ✅ Transaction cost estimate:", ethers.formatEther(gasEstimate * gasPriceWithBuffer), "CELO");

      testResults.transactionTests = {
        claimGasEstimate: gasEstimate.toString(),
        claimCostEstimate: ethers.formatEther(gasEstimate * gasPriceWithBuffer),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Transaction simulation failed:", error.message);
      testResults.transactionTests = { error: error.message };
    }

    // Display test summary
    console.log("\n" + "=".repeat(60));
    console.log("🔗 WALLET CONNECTIVITY TEST SUMMARY");
    console.log("=".repeat(60));

    const totalTests = Object.keys(testResults).length - 2; // Exclude network and timestamp
    const passedTests = Object.values(testResults).filter(test => 
      typeof test === 'object' && test.passed === true
    ).length;

    console.log(`📊 Test Results: ${passedTests}/${totalTests} test categories passed`);

    console.log("\n📋 Test Categories:");
    Object.entries(testResults).forEach(([category, result]) => {
      if (category !== 'network' && category !== 'timestamp') {
        const status = result.passed ? "✅ PASSED" : "❌ FAILED";
        console.log(`   ${category}: ${status}`);
      }
    });

    console.log("\n🔗 Contract Addresses:");
    console.log("   Rewards:", CONTRACTS.REWARDS);
    console.log("   NFTGem:", CONTRACTS.NFT_GEM);
    console.log("   Leaderboard:", CONTRACTS.LEADERBOARD);

    console.log("\n🌐 Explorer Links:");
    console.log("   Rewards:", `https://alfajores-blockscout.celo-testnet.org/address/${CONTRACTS.REWARDS}`);
    console.log("   NFTGem:", `https://alfajores-blockscout.celo-testnet.org/address/${CONTRACTS.NFT_GEM}`);
    console.log("   Leaderboard:", `https://alfajores-blockscout.celo-testnet.org/address/${CONTRACTS.LEADERBOARD}`);

    if (passedTests === totalTests) {
      console.log("\n🎉 All wallet connectivity tests passed!");
      console.log("✅ Contracts are ready for game integration");
    } else {
      console.log("\n⚠️  Some tests failed. Check the results for details.");
    }

    return testResults;

  } catch (error) {
    console.error("\n❌ Wallet connectivity test failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Wallet connectivity test failed:", error);
    process.exit(1);
  });
