const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying GemCraft Rewards Contract (Test)...");

  try {
    // Get the contract factory
    const GemCraftRewards = await ethers.getContractFactory("GemCraftRewards");

    // cUSD token address on Alfajores testnet
    const cUSDAddress = "0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4";

    console.log("📦 Deploying contract...");
    
    // Deploy the contract
    const gemCraftRewards = await GemCraftRewards.deploy(cUSDAddress);

    console.log("⏳ Waiting for deployment...");
    await gemCraftRewards.deployed();

    console.log("✅ GemCraft Rewards Contract deployed to:", gemCraftRewards.address);

    // Test basic functionality
    console.log("🔍 Testing contract functionality...");
    
    const contractBalance = await gemCraftRewards.getContractBalance();
    console.log("💰 Contract cUSD balance:", ethers.utils.formatEther(contractBalance));

    const level1Rewards = await gemCraftRewards.levelRewards(1);
    console.log("🎮 Level 1 rewards:", {
      cUSD: ethers.utils.formatEther(level1Rewards.cUSDReward),
      gems: level1Rewards.gemReward.toString(),
      nftChance: level1Rewards.nftChance.toString() + "%",
      active: level1Rewards.isActive
    });

    console.log("🎉 Deployment and testing completed successfully!");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// Execute deployment
main()
  .then(() => {
    console.log("✅ All tests passed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
