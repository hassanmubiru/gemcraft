// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Rewards
 * @dev Handles token rewards for game achievements
 * @notice This contract manages the distribution of test tokens for game milestones
 */
contract Rewards is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Token addresses for Alfajores testnet
    IERC20 public immutable cUSD;
    IERC20 public immutable CELO;

    // Reward amounts (in wei)
    uint256 public dailyBonusAmount = 1e18; // 1 cUSD
    uint256 public levelCompleteAmount = 5e17; // 0.5 cUSD
    uint256 public achievementAmount = 2e18; // 2 cUSD
    uint256 public comboBonusAmount = 1e17; // 0.1 cUSD

    // Reward tracking
    mapping(address => uint256) public lastDailyClaim;
    mapping(address => uint256) public totalRewardsClaimed;
    mapping(bytes32 => bool) public claimedRewards;

    // Events
    event RewardClaimed(
        address indexed player,
        uint256 amount,
        string rewardType,
        bytes32 rewardId
    );
    event RewardAmountUpdated(string rewardType, uint256 newAmount);
    event TokensWithdrawn(address token, uint256 amount);

    constructor(address _cUSD, address _CELO) {
        cUSD = IERC20(_cUSD);
        CELO = IERC20(_CELO);
    }

    /**
     * @dev Claim daily bonus reward
     * @notice Players can claim once per day
     */
    function claimDailyBonus() external nonReentrant whenNotPaused {
        require(
            block.timestamp >= lastDailyClaim[msg.sender] + 1 days,
            "Daily bonus already claimed"
        );

        lastDailyClaim[msg.sender] = block.timestamp;
        totalRewardsClaimed[msg.sender] += dailyBonusAmount;

        cUSD.safeTransfer(msg.sender, dailyBonusAmount);

        emit RewardClaimed(
            msg.sender,
            dailyBonusAmount,
            "daily_bonus",
            keccak256(abi.encodePacked(msg.sender, "daily_bonus", block.timestamp))
        );
    }

    /**
     * @dev Claim level completion reward
     * @param level The level number completed
     * @param score The score achieved
     * @param signature Server signature for verification
     */
    function claimLevelReward(
        uint256 level,
        uint256 score,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        bytes32 rewardId = keccak256(abi.encodePacked(msg.sender, level, score, "level_complete"));
        require(!claimedRewards[rewardId], "Reward already claimed");

        // Verify signature (simplified for demo)
        require(verifySignature(msg.sender, level, score, signature), "Invalid signature");

        claimedRewards[rewardId] = true;
        totalRewardsClaimed[msg.sender] += levelCompleteAmount;

        cUSD.safeTransfer(msg.sender, levelCompleteAmount);

        emit RewardClaimed(
            msg.sender,
            levelCompleteAmount,
            "level_complete",
            rewardId
        );
    }

    /**
     * @dev Claim achievement reward
     * @param achievementId The achievement ID
     * @param signature Server signature for verification
     */
    function claimAchievementReward(
        string calldata achievementId,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        bytes32 rewardId = keccak256(abi.encodePacked(msg.sender, achievementId, "achievement"));
        require(!claimedRewards[rewardId], "Reward already claimed");

        // Verify signature (simplified for demo)
        require(verifyAchievementSignature(msg.sender, achievementId, signature), "Invalid signature");

        claimedRewards[rewardId] = true;
        totalRewardsClaimed[msg.sender] += achievementAmount;

        cUSD.safeTransfer(msg.sender, achievementAmount);

        emit RewardClaimed(
            msg.sender,
            achievementAmount,
            "achievement",
            rewardId
        );
    }

    /**
     * @dev Claim combo bonus reward
     * @param comboCount The number of combos achieved
     * @param signature Server signature for verification
     */
    function claimComboReward(
        uint256 comboCount,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        require(comboCount >= 3, "Minimum 3 combos required");

        bytes32 rewardId = keccak256(abi.encodePacked(msg.sender, comboCount, "combo_bonus"));
        require(!claimedRewards[rewardId], "Reward already claimed");

        // Verify signature (simplified for demo)
        require(verifyComboSignature(msg.sender, comboCount, signature), "Invalid signature");

        uint256 rewardAmount = comboBonusAmount * comboCount;
        claimedRewards[rewardId] = true;
        totalRewardsClaimed[msg.sender] += rewardAmount;

        cUSD.safeTransfer(msg.sender, rewardAmount);

        emit RewardClaimed(
            msg.sender,
            rewardAmount,
            "combo_bonus",
            rewardId
        );
    }

    /**
     * @dev Batch claim multiple rewards
     * @param rewardTypes Array of reward types
     * @param amounts Array of amounts
     * @param signatures Array of signatures
     */
    function batchClaimRewards(
        string[] calldata rewardTypes,
        uint256[] calldata amounts,
        bytes[] calldata signatures
    ) external nonReentrant whenNotPaused {
        require(
            rewardTypes.length == amounts.length && amounts.length == signatures.length,
            "Arrays length mismatch"
        );

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < rewardTypes.length; i++) {
            bytes32 rewardId = keccak256(abi.encodePacked(msg.sender, rewardTypes[i], block.timestamp, i));
            require(!claimedRewards[rewardId], "Reward already claimed");

            // Verify signature (simplified for demo)
            require(verifyBatchSignature(msg.sender, rewardTypes[i], amounts[i], signatures[i]), "Invalid signature");

            claimedRewards[rewardId] = true;
            totalAmount += amounts[i];

            emit RewardClaimed(
                msg.sender,
                amounts[i],
                rewardTypes[i],
                rewardId
            );
        }

        totalRewardsClaimed[msg.sender] += totalAmount;
        cUSD.safeTransfer(msg.sender, totalAmount);
    }

    // Admin functions
    function updateRewardAmount(string calldata rewardType, uint256 newAmount) external onlyOwner {
        if (keccak256(bytes(rewardType)) == keccak256(bytes("daily_bonus"))) {
            dailyBonusAmount = newAmount;
        } else if (keccak256(bytes(rewardType)) == keccak256(bytes("level_complete"))) {
            levelCompleteAmount = newAmount;
        } else if (keccak256(bytes(rewardType)) == keccak256(bytes("achievement"))) {
            achievementAmount = newAmount;
        } else if (keccak256(bytes(rewardType)) == keccak256(bytes("combo_bonus"))) {
            comboBonusAmount = newAmount;
        }

        emit RewardAmountUpdated(rewardType, newAmount);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
        emit TokensWithdrawn(token, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function canClaimDailyBonus(address player) external view returns (bool) {
        return block.timestamp >= lastDailyClaim[player] + 1 days;
    }

    function getPlayerStats(address player) external view returns (
        uint256 lastDaily,
        uint256 totalClaimed,
        bool canClaimDaily
    ) {
        return (
            lastDailyClaim[player],
            totalRewardsClaimed[player],
            block.timestamp >= lastDailyClaim[player] + 1 days
        );
    }

    // Signature verification functions (simplified for demo)
    function verifySignature(
        address player,
        uint256 level,
        uint256 score,
        bytes calldata signature
    ) internal pure returns (bool) {
        // In production, implement proper signature verification
        // For demo purposes, we'll accept any signature
        return signature.length > 0;
    }

    function verifyAchievementSignature(
        address player,
        string calldata achievementId,
        bytes calldata signature
    ) internal pure returns (bool) {
        // In production, implement proper signature verification
        return signature.length > 0;
    }

    function verifyComboSignature(
        address player,
        uint256 comboCount,
        bytes calldata signature
    ) internal pure returns (bool) {
        // In production, implement proper signature verification
        return signature.length > 0;
    }

    function verifyBatchSignature(
        address player,
        string calldata rewardType,
        uint256 amount,
        bytes calldata signature
    ) internal pure returns (bool) {
        // In production, implement proper signature verification
        return signature.length > 0;
    }
}
