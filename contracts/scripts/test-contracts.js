// Contract testing script for GemCraft on Celo Alfajores
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🧪 Testing GemCraft contracts on Celo Alfajores...\n");

  // Use actual deployed contract addresses
  const deploymentInfo = {
    network: "alfajores",
    contracts: {
      rewards: {
        address: "0xd5ea8671F16BFB23044c54ed65eE3A7ab63BF58F",
        cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
        CELO: "0x0000000000000000000000000000000000000000",
      },
      nftGem: {
        address: "0x43161EAAC8726443B5AE5Cd7219cDeF8e43612Fe",
        baseURI: "https://api.gemcraft.celo.org/metadata/",
      },
      leaderboard: {
        address: "0x254e926B7AEFC03f8519800f25C44E96617475dC",
      },
    },
  };

  console.log("📋 Testing deployed contracts on Alfajores testnet");

  // Get signers
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const testUser = signers[1] || deployer; // Use deployer if no second signer
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 Test User:", testUser.address);

  const testResults = {
    network: deploymentInfo.network,
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // 1. Test Rewards Contract
    console.log("\n🎯 Testing Rewards Contract...");
    const rewards = await ethers.getContractAt("Rewards", deploymentInfo.contracts.rewards.address);
    
    const rewardsTests = {
      contractAddress: deploymentInfo.contracts.rewards.address,
      tests: {},
    };

    // Test 1: Check contract owner
    try {
      const owner = await rewards.owner();
      console.log("   ✅ Owner check:", owner === deployer.address ? "PASS" : "FAIL");
      rewardsTests.tests.ownerCheck = {
        expected: deployer.address,
        actual: owner,
        passed: owner === deployer.address,
      };
    } catch (error) {
      console.log("   ❌ Owner check failed:", error.message);
      rewardsTests.tests.ownerCheck = { error: error.message };
    }

    // Test 2: Check reward amounts
    try {
      const dailyBonus = await rewards.dailyBonusAmount();
      const levelComplete = await rewards.levelCompleteAmount();
      const achievement = await rewards.achievementAmount();
      const comboBonus = await rewards.comboBonusAmount();
      
      console.log("   ✅ Reward amounts:");
      console.log(`      Daily Bonus: ${ethers.utils.formatEther(dailyBonus)} cUSD`);
      console.log(`      Level Complete: ${ethers.utils.formatEther(levelComplete)} cUSD`);
      console.log(`      Achievement: ${ethers.utils.formatEther(achievement)} cUSD`);
      console.log(`      Combo Bonus: ${ethers.utils.formatEther(comboBonus)} cUSD`);
      
      rewardsTests.tests.rewardAmounts = {
        dailyBonus: ethers.utils.formatEther(dailyBonus),
        levelComplete: ethers.utils.formatEther(levelComplete),
        achievement: ethers.utils.formatEther(achievement),
        comboBonus: ethers.utils.formatEther(comboBonus),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Reward amounts check failed:", error.message);
      rewardsTests.tests.rewardAmounts = { error: error.message };
    }

    // Test 3: Check cUSD balance
    try {
      const cUSD = await ethers.getContractAt("IERC20", deploymentInfo.contracts.rewards.cUSD);
      const balance = await cUSD.balanceOf(rewards.address);
      console.log("   ✅ cUSD balance:", ethers.utils.formatEther(balance), "cUSD");
      rewardsTests.tests.cUSDBalance = {
        balance: ethers.utils.formatEther(balance),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ cUSD balance check failed:", error.message);
      rewardsTests.tests.cUSDBalance = { error: error.message };
    }

    // Test 4: Test daily bonus claim (if user has cUSD)
    try {
      const canClaim = await rewards.canClaimDailyBonus(testUser.address);
      console.log("   ✅ Can claim daily bonus:", canClaim ? "YES" : "NO");
      rewardsTests.tests.dailyBonusCheck = {
        canClaim: canClaim,
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Daily bonus check failed:", error.message);
      rewardsTests.tests.dailyBonusCheck = { error: error.message };
    }

    testResults.tests.rewards = rewardsTests;

    // 2. Test NFTGem Contract
    console.log("\n💎 Testing NFTGem Contract...");
    const nftGem = await ethers.getContractAt("NFTGem", deploymentInfo.contracts.nftGem.address);
    
    const nftTests = {
      contractAddress: deploymentInfo.contracts.nftGem.address,
      tests: {},
    };

    // Test 1: Check contract owner
    try {
      const owner = await nftGem.owner();
      console.log("   ✅ Owner check:", owner === deployer.address ? "PASS" : "FAIL");
      nftTests.tests.ownerCheck = {
        expected: deployer.address,
        actual: owner,
        passed: owner === deployer.address,
      };
    } catch (error) {
      console.log("   ❌ Owner check failed:", error.message);
      nftTests.tests.ownerCheck = { error: error.message };
    }

    // Test 2: Check total supply
    try {
      const totalSupply = await nftGem.totalSupply();
      console.log("   ✅ Total supply:", totalSupply.toString());
      nftTests.tests.totalSupply = {
        supply: totalSupply.toString(),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Total supply check failed:", error.message);
      nftTests.tests.totalSupply = { error: error.message };
    }

    // Test 3: Check mint prices
    try {
      const commonPrice = await nftGem.getMintPrice(0); // Common
      const rarePrice = await nftGem.getMintPrice(1); // Rare
      const epicPrice = await nftGem.getMintPrice(2); // Epic
      const legendaryPrice = await nftGem.getMintPrice(3); // Legendary
      
      console.log("   ✅ Mint prices:");
      console.log(`      Common: ${ethers.utils.formatEther(commonPrice)} cUSD`);
      console.log(`      Rare: ${ethers.utils.formatEther(rarePrice)} cUSD`);
      console.log(`      Epic: ${ethers.utils.formatEther(epicPrice)} cUSD`);
      console.log(`      Legendary: ${ethers.utils.formatEther(legendaryPrice)} cUSD`);
      
      nftTests.tests.mintPrices = {
        common: ethers.utils.formatEther(commonPrice),
        rare: ethers.utils.formatEther(rarePrice),
        epic: ethers.utils.formatEther(epicPrice),
        legendary: ethers.utils.formatEther(legendaryPrice),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Mint prices check failed:", error.message);
      nftTests.tests.mintPrices = { error: error.message };
    }

    // Test 4: Check deployer's NFTs
    try {
      const deployerTokens = await nftGem.getPlayerTokens(deployer.address);
      console.log("   ✅ Deployer's NFTs:", deployerTokens.length, "tokens");
      
      if (deployerTokens.length > 0) {
        const firstToken = deployerTokens[0];
        const gemData = await nftGem.getGemData(firstToken);
        console.log(`      First NFT: ID ${firstToken}, Type ${gemData.gemType}, Rarity ${gemData.rarity}`);
      }
      
      nftTests.tests.deployerTokens = {
        count: deployerTokens.length,
        tokens: deployerTokens.map(t => t.toString()),
        passed: true,
      };
    } catch (error) {
      console.log("   ❌ Deployer tokens check failed:", error.message);
      nftTests.tests.deployerTokens = { error: error.message };
    }

    testResults.tests.nftGem = nftTests;

    // 3. Test Leaderboard Contract (if exists)
    if (deploymentInfo.contracts.leaderboard) {
      console.log("\n🏆 Testing Leaderboard Contract...");
      const leaderboard = await ethers.getContractAt("Leaderboard", deploymentInfo.contracts.leaderboard.address);
      
      const leaderboardTests = {
        contractAddress: deploymentInfo.contracts.leaderboard.address,
        tests: {},
      };

      // Test 1: Check contract owner
      try {
        const owner = await leaderboard.owner();
        console.log("   ✅ Owner check:", owner === deployer.address ? "PASS" : "FAIL");
        leaderboardTests.tests.ownerCheck = {
          expected: deployer.address,
          actual: owner,
          passed: owner === deployer.address,
        };
      } catch (error) {
        console.log("   ❌ Owner check failed:", error.message);
        leaderboardTests.tests.ownerCheck = { error: error.message };
      }

      testResults.tests.leaderboard = leaderboardTests;
    }

    // 4. Test contract interactions
    console.log("\n🔄 Testing Contract Interactions...");
    
    // Test minting a new NFT
    try {
      console.log("   Testing NFT minting...");
      const mintTx = await nftGem.mintGem(
        testUser.address,
        0, // Ruby
        1, // Rare
        1, // RowClear
        5  // Level 5
      );
      const mintReceipt = await mintTx.wait();
      
      console.log("   ✅ NFT minted successfully");
      console.log("      Transaction hash:", mintReceipt.transactionHash);
      console.log("      Gas used:", mintReceipt.gasUsed.toString());
      
      testResults.tests.nftMinting = {
        success: true,
        transactionHash: mintReceipt.transactionHash,
        gasUsed: mintReceipt.gasUsed.toString(),
      };
    } catch (error) {
      console.log("   ❌ NFT minting failed:", error.message);
      testResults.tests.nftMinting = { error: error.message };
    }

    // Save test results
    const testFileName = `test-results-${Date.now()}.json`;
    const testFilePath = path.join(deploymentPath, testFileName);
    fs.writeFileSync(testFilePath, JSON.stringify(testResults, null, 2));

    // Display test summary
    console.log("\n" + "=".repeat(60));
    console.log("🧪 CONTRACT TEST SUMMARY");
    console.log("=".repeat(60));

    const totalTests = Object.values(testResults.tests).reduce((sum, contract) => {
      return sum + Object.keys(contract.tests || {}).length;
    }, 0);

    const passedTests = Object.values(testResults.tests).reduce((sum, contract) => {
      return sum + Object.values(contract.tests || {}).filter(test => test.passed).length;
    }, 0);

    console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

    console.log("\n📋 Contract Test Status:");
    Object.entries(testResults.tests).forEach(([contractName, contract]) => {
      const contractTests = Object.values(contract.tests || {});
      const contractPassed = contractTests.filter(test => test.passed).length;
      const contractTotal = contractTests.length;
      console.log(`   ${contractName}: ${contractPassed}/${contractTotal} tests passed`);
    });

    console.log(`\n💾 Test results saved to: ${testFilePath}`);

    if (passedTests === totalTests) {
      console.log("\n🎉 All tests passed! Contracts are working correctly.");
    } else {
      console.log("\n⚠️  Some tests failed. Check the results for details.");
    }

    console.log("\n🔗 Contract Explorer Links:");
    console.log(`   Rewards: https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.rewards.address}`);
    console.log(`   NFTGem: https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.nftGem.address}`);
    if (deploymentInfo.contracts.leaderboard) {
      console.log(`   Leaderboard: https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.leaderboard.address}`);
    }

    return testResults;

  } catch (error) {
    console.error("\n❌ Testing failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Testing failed:", error);
    process.exit(1);
  });
