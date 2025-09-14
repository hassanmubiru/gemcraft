const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying GemCraft Rewards Contract...");

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
    console.log("🎉 Deployment completed successfully!");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

// Execute deployment
main()
  .then(() => {
    console.log("✅ Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
