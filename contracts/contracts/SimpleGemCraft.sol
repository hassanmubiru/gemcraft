// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SimpleGemCraft
 * @dev Simplified version of GemCraft rewards contract for testing
 */
contract SimpleGemCraft is Ownable {
    IERC20 public cUSD;
    
    struct LevelReward {
        uint256 cUSDReward;
        uint256 gemReward;
        uint256 nftChance;
        bool isActive;
    }
    
    mapping(uint256 => LevelReward) public levelRewards;
    mapping(address => uint256) public playerScores;
    
    event LevelCompleted(
        address indexed player,
        uint256 levelId,
        uint256 score,
        uint256 cUSDReward
    );
    
    constructor(address _cUSD) {
        cUSD = IERC20(_cUSD);
        _setupDefaultRewards();
    }
    
    function _setupDefaultRewards() private {
        levelRewards[1] = LevelReward(0.1 ether, 10, 1, true);
        levelRewards[2] = LevelReward(0.2 ether, 20, 2, true);
        levelRewards[3] = LevelReward(0.3 ether, 30, 3, true);
    }
    
    function completeLevel(
        uint256 levelId,
        uint256 score,
        uint256 targetScore
    ) external {
        require(levelId > 0 && levelId <= 10, "Invalid level");
        require(score >= targetScore, "Score below target");
        
        LevelReward memory reward = levelRewards[levelId];
        require(reward.isActive, "Level not active");
        
        // Calculate reward
        uint256 cUSDReward = reward.cUSDReward;
        if (score >= targetScore * 2) {
            cUSDReward = cUSDReward * 2; // 2x for double target
        }
        
        // Transfer reward
        if (cUSDReward > 0) {
            require(cUSD.transfer(msg.sender, cUSDReward), "Transfer failed");
        }
        
        // Update player score
        playerScores[msg.sender] += score;
        
        emit LevelCompleted(msg.sender, levelId, score, cUSDReward);
    }
    
    function getPlayerScore(address player) external view returns (uint256) {
        return playerScores[player];
    }
    
    function getContractBalance() external view returns (uint256) {
        return cUSD.balanceOf(address(this));
    }
}
