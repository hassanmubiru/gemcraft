const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying GemCraft Rewards Contract...");

  // Get the contract factory
  const GemCraftRewards = await ethers.getContractFactory("GemCraftRewards");

  // cUSD token address on Alfajores testnet
  const cUSDAddress = "0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4";

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const gemCraftRewards = await GemCraftRewards.deploy(cUSDAddress);

  await gemCraftRewards.deployed();

  console.log("✅ GemCraft Rewards Contract deployed to:", gemCraftRewards.address);
  console.log("🔗 Contract on Alfajores Explorer:", `https://alfajores-blockscout.celo-testnet.org/address/${gemCraftRewards.address}`);

  // Verify contract deployment
  console.log("🔍 Verifying deployment...");
  const contractBalance = await gemCraftRewards.getContractBalance();
  console.log("💰 Contract cUSD balance:", ethers.utils.formatEther(contractBalance));

  // Get level 1 rewards as example
  const level1Rewards = await gemCraftRewards.levelRewards(1);
  console.log("🎮 Level 1 rewards:", {
    cUSD: ethers.utils.formatEther(level1Rewards.cUSDReward),
    gems: level1Rewards.gemReward.toString(),
    nftChance: level1Rewards.nftChance.toString() + "%",
    active: level1Rewards.isActive
  });

  // Save deployment info
  const deploymentInfo = {
    network: "alfajores",
    contractAddress: gemCraftRewards.address,
    cUSDAddress: cUSDAddress,
    deployer: await gemCraftRewards.owner(),
    deploymentTime: new Date().toISOString(),
    transactionHash: gemCraftRewards.deployTransaction.hash
  };

  console.log("📄 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));

  // Instructions for next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Fund the contract with cUSD tokens for rewards");
  console.log("2. Update the frontend with the contract address");
  console.log("3. Test level completion and reward claiming");
  console.log("4. Monitor contract events and transactions");

  return deploymentInfo;
}

// Execute deployment
main()
  .then((deploymentInfo) => {
    console.log("🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
