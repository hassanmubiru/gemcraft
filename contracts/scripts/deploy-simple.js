const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Simple GemCraft Contract...");

  try {
    const SimpleGemCraft = await ethers.getContractFactory("SimpleGemCraft");
    const cUSDAddress = "0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4";
    
    console.log("📦 Deploying...");
    const contract = await SimpleGemCraft.deploy(cUSDAddress);
    await contract.deployed();
    
    console.log("✅ Contract deployed to:", contract.address);
    console.log("🎉 Success!");

  } catch (error) {
    console.error("❌ Failed:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });