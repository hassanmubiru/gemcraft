// Contract verification script for GemCraft on Celo Alfajores
const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Starting contract verification on Celo Alfajores...\n");

  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployments");
  const files = fs.readdirSync(deploymentPath);
  const latestDeployment = files
    .filter(file => file.startsWith("gemcraft-alfajores-") && file.endsWith(".json"))
    .sort()
    .pop();

  if (!latestDeployment) {
    console.log("❌ No deployment file found. Please deploy contracts first.");
    return;
  }

  const deploymentFile = path.join(deploymentPath, latestDeployment);
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

  console.log("📋 Verifying contracts from deployment:", latestDeployment);
  console.log("   Network:", deploymentInfo.network);
  console.log("   Deployer:", deploymentInfo.deployer);
  console.log("   Block Number:", deploymentInfo.blockNumber);

  const verificationResults = {
    network: deploymentInfo.network,
    timestamp: new Date().toISOString(),
    contracts: {},
  };

  try {
    // Verify Rewards Contract
    console.log("\n🎯 Verifying Rewards contract...");
    try {
      await run("verify:verify", {
        address: deploymentInfo.contracts.rewards.address,
        constructorArguments: [
          deploymentInfo.contracts.rewards.cUSD,
          deploymentInfo.contracts.rewards.CELO,
        ],
        network: "alfajores",
      });
      console.log("✅ Rewards contract verified successfully");
      verificationResults.contracts.rewards = {
        address: deploymentInfo.contracts.rewards.address,
        verified: true,
        explorerUrl: `https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.rewards.address}`,
      };
    } catch (error) {
      console.log("⚠️  Rewards contract verification failed:", error.message);
      verificationResults.contracts.rewards = {
        address: deploymentInfo.contracts.rewards.address,
        verified: false,
        error: error.message,
      };
    }

    // Verify NFTGem Contract
    console.log("\n💎 Verifying NFTGem contract...");
    try {
      await run("verify:verify", {
        address: deploymentInfo.contracts.nftGem.address,
        constructorArguments: [deploymentInfo.contracts.nftGem.baseURI],
        network: "alfajores",
      });
      console.log("✅ NFTGem contract verified successfully");
      verificationResults.contracts.nftGem = {
        address: deploymentInfo.contracts.nftGem.address,
        verified: true,
        explorerUrl: `https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.nftGem.address}`,
      };
    } catch (error) {
      console.log("⚠️  NFTGem contract verification failed:", error.message);
      verificationResults.contracts.nftGem = {
        address: deploymentInfo.contracts.nftGem.address,
        verified: false,
        error: error.message,
      };
    }

    // Verify Leaderboard Contract (if exists)
    if (deploymentInfo.contracts.leaderboard) {
      console.log("\n🏆 Verifying Leaderboard contract...");
      try {
        await run("verify:verify", {
          address: deploymentInfo.contracts.leaderboard.address,
          constructorArguments: [],
          network: "alfajores",
        });
        console.log("✅ Leaderboard contract verified successfully");
        verificationResults.contracts.leaderboard = {
          address: deploymentInfo.contracts.leaderboard.address,
          verified: true,
          explorerUrl: `https://alfajores-blockscout.celo-testnet.org/address/${deploymentInfo.contracts.leaderboard.address}`,
        };
      } catch (error) {
        console.log("⚠️  Leaderboard contract verification failed:", error.message);
        verificationResults.contracts.leaderboard = {
          address: deploymentInfo.contracts.leaderboard.address,
          verified: false,
          error: error.message,
        };
      }
    }

    // Save verification results
    const verificationFileName = `verification-${Date.now()}.json`;
    const verificationFilePath = path.join(deploymentPath, verificationFileName);
    fs.writeFileSync(verificationFilePath, JSON.stringify(verificationResults, null, 2));

    // Display verification summary
    console.log("\n" + "=".repeat(60));
    console.log("🔍 CONTRACT VERIFICATION SUMMARY");
    console.log("=".repeat(60));

    const verifiedCount = Object.values(verificationResults.contracts).filter(c => c.verified).length;
    const totalCount = Object.keys(verificationResults.contracts).length;

    console.log(`📊 Verification Results: ${verifiedCount}/${totalCount} contracts verified`);

    console.log("\n📋 Contract Status:");
    Object.entries(verificationResults.contracts).forEach(([name, contract]) => {
      const status = contract.verified ? "✅ Verified" : "❌ Failed";
      console.log(`   ${name}: ${status}`);
      if (contract.verified && contract.explorerUrl) {
        console.log(`      Explorer: ${contract.explorerUrl}`);
      }
      if (!contract.verified && contract.error) {
        console.log(`      Error: ${contract.error}`);
      }
    });

    console.log(`\n💾 Verification results saved to: ${verificationFilePath}`);

    if (verifiedCount === totalCount) {
      console.log("\n🎉 All contracts verified successfully!");
      console.log("🔗 You can now view your contracts on Celo Explorer:");
      Object.values(verificationResults.contracts).forEach(contract => {
        if (contract.verified && contract.explorerUrl) {
          console.log(`   ${contract.explorerUrl}`);
        }
      });
    } else {
      console.log("\n⚠️  Some contracts failed verification.");
      console.log("💡 You can try verifying them manually using the Hardhat verify command:");
      console.log("   npx hardhat verify --network alfajores <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>");
    }

    return verificationResults;

  } catch (error) {
    console.error("\n❌ Verification process failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Verification failed:", error);
    process.exit(1);
  });
