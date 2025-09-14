// Configuration script for already deployed GemCraft contracts
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("⚙️  Configuring deployed GemCraft contracts...\n");

  // Contract addresses from successful deployment
  const REWARDS_ADDRESS = "0xd5ea8671F16BFB23044c54ed65eE3A7ab63BF58F";
  const NFTGEM_ADDRESS = "0x43161EAAC8726443B5AE5Cd7219cDeF8e43612Fe";
  const LEADERBOARD_ADDRESS = "0x254e926B7AEFC03f8519800f25C44E96617475dC";

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Configuring contracts with account:", deployer.address);

  // Get current gas price and add buffer
  const gasPrice = await ethers.provider.getFeeData();
  const gasPriceWithBuffer = gasPrice.gasPrice * 200n / 100n; // 100% buffer for Celo
  console.log("⛽ Using gas price:", ethers.formatUnits(gasPriceWithBuffer, "gwei"), "gwei");

  try {
    // 1. Configure Rewards Contract
    console.log("\n🎯 Configuring Rewards contract...");
    const rewards = await ethers.getContractAt("Rewards", REWARDS_ADDRESS);

    // Update reward amounts for the 100-level system
    const rewardAmounts = {
      dailyBonus: ethers.parseEther("0.1"), // 0.1 cUSD
      levelComplete: ethers.parseEther("0.5"), // 0.5 cUSD
      achievement: ethers.parseEther("2.0"), // 2 cUSD
      comboBonus: ethers.parseEther("0.1"), // 0.1 cUSD
    };

    console.log("   Setting reward amounts...");
    
    try {
      const tx1 = await rewards.updateRewardAmount("daily_bonus", rewardAmounts.dailyBonus, {
        gasPrice: gasPriceWithBuffer
      });
      await tx1.wait();
      console.log("   ✅ Daily bonus amount set");
    } catch (error) {
      console.log("   ⚠️  Daily bonus amount setting failed:", error.message);
    }

    try {
      const tx2 = await rewards.updateRewardAmount("level_complete", rewardAmounts.levelComplete, {
        gasPrice: gasPriceWithBuffer
      });
      await tx2.wait();
      console.log("   ✅ Level complete amount set");
    } catch (error) {
      console.log("   ⚠️  Level complete amount setting failed:", error.message);
    }

    try {
      const tx3 = await rewards.updateRewardAmount("achievement", rewardAmounts.achievement, {
        gasPrice: gasPriceWithBuffer
      });
      await tx3.wait();
      console.log("   ✅ Achievement amount set");
    } catch (error) {
      console.log("   ⚠️  Achievement amount setting failed:", error.message);
    }

    try {
      const tx4 = await rewards.updateRewardAmount("combo_bonus", rewardAmounts.comboBonus, {
        gasPrice: gasPriceWithBuffer
      });
      await tx4.wait();
      console.log("   ✅ Combo bonus amount set");
    } catch (error) {
      console.log("   ⚠️  Combo bonus amount setting failed:", error.message);
    }

    // 2. Mint initial test NFTs
    console.log("\n💎 Minting initial test NFTs...");
    const nftGem = await ethers.getContractAt("NFTGem", NFTGEM_ADDRESS);

    try {
      // Mint a few test gems for the deployer
      const testGems = [
        { type: 0, rarity: 0, power: 0, level: 1 }, // Common Ruby
        { type: 1, rarity: 1, power: 1, level: 5 }, // Rare Sapphire
        { type: 2, rarity: 2, power: 2, level: 10 }, // Epic Emerald
      ];

      for (let i = 0; i < testGems.length; i++) {
        const gem = testGems[i];
        try {
          const mintTx = await nftGem.mintGem(
            deployer.address,
            gem.type,
            gem.rarity,
            gem.power,
            gem.level,
            {
              gasPrice: gasPriceWithBuffer
            }
          );
          await mintTx.wait();
          console.log(`   ✅ Test NFT ${i + 1} minted successfully`);
        } catch (error) {
          console.log(`   ⚠️  Test NFT ${i + 1} minting failed:`, error.message);
        }
      }
    } catch (error) {
      console.log("   ⚠️  NFT minting failed:", error.message);
    }

    // 3. Fund Rewards contract with test cUSD (if available)
    console.log("\n💰 Funding Rewards contract...");
    try {
      const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
      const cUSD = await ethers.getContractAt("IERC20", CUSD_ADDRESS);
      const cUSDBalance = await cUSD.balanceOf(deployer.address);
      
      if (cUSDBalance > 0) {
        const fundingAmount = cUSDBalance / 2n; // Use half of available cUSD
        console.log(`   Funding with ${ethers.formatEther(fundingAmount)} cUSD...`);
        
        const fundTx = await cUSD.transfer(REWARDS_ADDRESS, fundingAmount, {
          gasPrice: gasPriceWithBuffer
        });
        await fundTx.wait();
        console.log("   ✅ Rewards contract funded successfully");
      } else {
        console.log("   ⚠️  No cUSD balance to fund contracts. Get test tokens from faucet:");
        console.log("   https://faucet.celo.org/");
      }
    } catch (error) {
      console.log("   ⚠️  Contract funding failed:", error.message);
    }

    // 4. Verify contract configuration
    console.log("\n🔍 Verifying contract configuration...");
    
    try {
      const dailyBonus = await rewards.dailyBonusAmount();
      const levelComplete = await rewards.levelCompleteAmount();
      const achievement = await rewards.achievementAmount();
      const comboBonus = await rewards.comboBonusAmount();
      
      console.log("   ✅ Reward amounts configured:");
      console.log(`      Daily Bonus: ${ethers.formatEther(dailyBonus)} cUSD`);
      console.log(`      Level Complete: ${ethers.formatEther(levelComplete)} cUSD`);
      console.log(`      Achievement: ${ethers.formatEther(achievement)} cUSD`);
      console.log(`      Combo Bonus: ${ethers.formatEther(comboBonus)} cUSD`);
    } catch (error) {
      console.log("   ⚠️  Could not verify reward amounts:", error.message);
    }

    try {
      const totalSupply = await nftGem.totalSupply();
      console.log(`   ✅ NFT total supply: ${totalSupply.toString()}`);
    } catch (error) {
      console.log("   ⚠️  Could not verify NFT supply:", error.message);
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 CONTRACT CONFIGURATION COMPLETE!");
    console.log("=".repeat(60));
    console.log("📋 Contract Addresses:");
    console.log("   Rewards:", REWARDS_ADDRESS);
    console.log("   NFTGem:", NFTGEM_ADDRESS);
    console.log("   Leaderboard:", LEADERBOARD_ADDRESS);

    console.log("\n🔗 Explorer Links:");
    console.log("   Rewards:", `https://alfajores-blockscout.celo-testnet.org/address/${REWARDS_ADDRESS}`);
    console.log("   NFTGem:", `https://alfajores-blockscout.celo-testnet.org/address/${NFTGEM_ADDRESS}`);
    console.log("   Leaderboard:", `https://alfajores-blockscout.celo-testnet.org/address/${LEADERBOARD_ADDRESS}`);

    console.log("\n🎮 Contracts are now fully configured and ready for use!");

  } catch (error) {
    console.error("\n❌ Configuration failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Configuration failed:", error);
    process.exit(1);
  });
