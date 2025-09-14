const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Simple Test Contract...");

  try {
    const SimpleTest = await ethers.getContractFactory("SimpleTest");
    const simpleTest = await SimpleTest.deploy("Hello GemCraft!");
    await simpleTest.deployed();
    
    console.log("✅ Simple Test Contract deployed to:", simpleTest.address);
    console.log("📝 Message:", await simpleTest.getMessage());
    console.log("🎉 Deployment successful!");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
