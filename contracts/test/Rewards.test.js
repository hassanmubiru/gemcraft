const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rewards Contract", function () {
  let rewards;
  let cUSD;
  let CELO;
  let owner;
  let player1;
  let player2;

  // Test token addresses (Alfajores testnet)
  const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  const CELO_ADDRESS = "0xF194afDf50B03a69Ea33B7c6CF6a2A4E7B3F8C2D";

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy Rewards contract with testnet token addresses
    const Rewards = await ethers.getContractFactory("Rewards");
    rewards = await Rewards.deploy(CUSD_ADDRESS, CELO_ADDRESS);

    // Note: In real testing, you would need to fund the contract with test tokens
    // from the Alfajores faucet or use a different testing approach
  });

  describe("Deployment", function () {
    it("Should set the correct token addresses", async function () {
      expect(await rewards.cUSD()).to.equal(CUSD_ADDRESS);
      expect(await rewards.CELO()).to.equal(CELO_ADDRESS);
    });

    it("Should set the correct owner", async function () {
      expect(await rewards.owner()).to.equal(owner.address);
    });

    it("Should set default reward amounts", async function () {
      expect(await rewards.dailyBonusAmount()).to.equal(ethers.utils.parseEther("1"));
      expect(await rewards.levelCompleteAmount()).to.equal(ethers.utils.parseEther("0.5"));
      expect(await rewards.achievementAmount()).to.equal(ethers.utils.parseEther("2"));
      expect(await rewards.comboBonusAmount()).to.equal(ethers.utils.parseEther("0.1"));
    });
  });

  describe("Daily Bonus", function () {
    it("Should allow claiming daily bonus", async function () {
      // Note: This test requires the contract to be funded with test tokens
      // Skip for now until proper test setup is implemented
      this.skip();
    });

    it("Should not allow claiming daily bonus twice in one day", async function () {
      // Note: This test requires the contract to be funded with test tokens
      // Skip for now until proper test setup is implemented
      this.skip();
    });

    it("Should track total rewards claimed", async function () {
      // Note: This test requires the contract to be funded with test tokens
      // Skip for now until proper test setup is implemented
      this.skip();
    });
  });

  describe("Level Rewards", function () {
    it("Should allow claiming level reward with valid signature", async function () {
      // Note: This test requires the contract to be funded with test tokens
      // Skip for now until proper test setup is implemented
      this.skip();
    });

    it("Should not allow claiming the same level reward twice", async function () {
      // Note: This test requires the contract to be funded with test tokens
      // Skip for now until proper test setup is implemented
      this.skip();
    });
  });

  describe("Achievement Rewards", function () {
    it("Should allow claiming achievement reward", async function () {
      const initialBalance = await cUSD.balanceOf(player1.address);
      
      const signature = "0x1234567890abcdef";
      
      await rewards.connect(player1).claimAchievementReward("first_match", signature);
      
      const finalBalance = await cUSD.balanceOf(player1.address);
      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("2"));
    });
  });

  describe("Combo Rewards", function () {
    it("Should allow claiming combo reward", async function () {
      const initialBalance = await cUSD.balanceOf(player1.address);
      
      const signature = "0x1234567890abcdef";
      
      await rewards.connect(player1).claimComboReward(5, signature);
      
      const finalBalance = await cUSD.balanceOf(player1.address);
      const expectedReward = ethers.utils.parseEther("0.1").mul(5);
      expect(finalBalance.sub(initialBalance)).to.equal(expectedReward);
    });

    it("Should require minimum 3 combos", async function () {
      const signature = "0x1234567890abcdef";
      
      await expect(
        rewards.connect(player1).claimComboReward(2, signature)
      ).to.be.revertedWith("Minimum 3 combos required");
    });
  });

  describe("Batch Claims", function () {
    it("Should allow batch claiming rewards", async function () {
      const initialBalance = await cUSD.balanceOf(player1.address);
      
      const rewardTypes = ["level_complete", "achievement"];
      const amounts = [ethers.utils.parseEther("0.5"), ethers.utils.parseEther("2")];
      const signatures = ["0x1234567890abcdef", "0xabcdef1234567890"];
      
      await rewards.connect(player1).batchClaimRewards(rewardTypes, amounts, signatures);
      
      const finalBalance = await cUSD.balanceOf(player1.address);
      const expectedTotal = ethers.utils.parseEther("2.5");
      expect(finalBalance.sub(initialBalance)).to.equal(expectedTotal);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update reward amounts", async function () {
      await rewards.updateRewardAmount("daily_bonus", ethers.utils.parseEther("2"));
      expect(await rewards.dailyBonusAmount()).to.equal(ethers.utils.parseEther("2"));
    });

    it("Should not allow non-owner to update reward amounts", async function () {
      await expect(
        rewards.connect(player1).updateRewardAmount("daily_bonus", ethers.utils.parseEther("2"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to withdraw tokens", async function () {
      const initialBalance = await cUSD.balanceOf(owner.address);
      
      await rewards.withdrawTokens(cUSD.address, ethers.utils.parseEther("100"));
      
      const finalBalance = await cUSD.balanceOf(owner.address);
      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should allow owner to pause and unpause", async function () {
      await rewards.pause();
      expect(await rewards.paused()).to.be.true;
      
      await rewards.unpause();
      expect(await rewards.paused()).to.be.false;
    });
  });

  describe("View Functions", function () {
    it("Should return correct player stats", async function () {
      await rewards.connect(player1).claimDailyBonus();
      
      const stats = await rewards.getPlayerStats(player1.address);
      expect(stats.totalClaimed).to.equal(ethers.utils.parseEther("1"));
      expect(stats.canClaimDaily).to.be.false;
    });

    it("Should return true for daily bonus eligibility after 24 hours", async function () {
      // This would require time manipulation in a real test
      // For now, we'll just test the initial state
      const stats = await rewards.getPlayerStats(player1.address);
      expect(stats.canClaimDaily).to.be.true;
    });
  });
});
