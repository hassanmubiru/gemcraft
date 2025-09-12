const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment to Celo Alfajores...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Celo Alfajores testnet token addresses
  const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Test cUSD
  const CELO_ADDRESS = "0xF194afDf50B03a69Ea33B7c6CF6a2A4E7B3F8C2D"; // Test CELO

  // Deploy Rewards contract
  console.log("\nDeploying Rewards contract...");
  const Rewards = await ethers.getContractFactory("Rewards");
  const rewards = await Rewards.deploy(CUSD_ADDRESS, CELO_ADDRESS);
  await rewards.deployed();
  console.log("Rewards contract deployed to:", rewards.address);

  // Deploy NFTGem contract
  console.log("\nDeploying NFTGem contract...");
  const NFTGem = await ethers.getContractFactory("NFTGem");
  const nftGem = await NFTGem.deploy("https://api.gemcraft.com/metadata/");
  await nftGem.deployed();
  console.log("NFTGem contract deployed to:", nftGem.address);

  // Deploy Leaderboard contract
  console.log("\nDeploying Leaderboard contract...");
  const Leaderboard = await ethers.getContractFactory("Leaderboard");
  const leaderboard = await Leaderboard.deploy();
  await leaderboard.deployed();
  console.log("Leaderboard contract deployed to:", leaderboard.address);

  // Save deployment info
  const deploymentInfo = {
    network: "alfajores",
    deployer: deployer.address,
    contracts: {
      rewards: {
        address: rewards.address,
        cUSD: CUSD_ADDRESS,
        CELO: CELO_ADDRESS,
      },
      nftGem: {
        address: nftGem.address,
        baseURI: "https://api.gemcraft.com/metadata/",
      },
      leaderboard: {
        address: leaderboard.address,
      },
    },
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  console.log("\n=== Deployment Summary ===");
  console.log("Network: Alfajores Testnet");
  console.log("Deployer:", deployer.address);
  console.log("Rewards Contract:", rewards.address);
  console.log("NFTGem Contract:", nftGem.address);
  console.log("Leaderboard Contract:", leaderboard.address);
  console.log("Block Number:", deploymentInfo.blockNumber);

  // Save to file
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "../deployments");
  
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  const fileName = `alfajores-${Date.now()}.json`;
  const filePath = path.join(deploymentPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\nDeployment info saved to: ${filePath}`);

  // Instructions for next steps
  console.log("\n=== Next Steps ===");
  console.log("1. Update your .env file with the contract addresses:");
  console.log(`   REWARDS_CONTRACT_ADDRESS=${rewards.address}`);
  console.log(`   NFT_GEM_CONTRACT_ADDRESS=${nftGem.address}`);
  console.log(`   LEADERBOARD_CONTRACT_ADDRESS=${leaderboard.address}`);
  console.log("\n2. Fund the contracts with test tokens:");
  console.log(`   - Send test cUSD to: ${rewards.address}`);
  console.log(`   - Use the Alfajores faucet: https://faucet.celo.org/`);
  console.log("\n3. Verify contracts on Celo Explorer:");
  console.log(`   npx hardhat verify --network alfajores ${rewards.address} "${CUSD_ADDRESS}" "${CELO_ADDRESS}"`);
  console.log(`   npx hardhat verify --network alfajores ${nftGem.address} "https://api.gemcraft.com/metadata/"`);
  console.log(`   npx hardhat verify --network alfajores ${leaderboard.address}`);

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
