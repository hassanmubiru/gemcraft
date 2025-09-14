// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GemCraftRewards
 * @dev Smart contract for GemCraft game rewards and NFT system
 */
contract GemCraftRewards is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Game configuration
    struct LevelReward {
        uint256 cUSDReward;
        uint256 gemReward;
        uint256 nftChance; // Percentage (0-100)
        bool isActive;
    }
    
    struct PlayerStats {
        uint256 totalScore;
        uint256 levelsCompleted;
        uint256 totalRewards;
        uint256 nftsMinted;
        uint256 lastPlayTime;
    }
    
    // State variables
    mapping(uint256 => LevelReward) public levelRewards;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256[]) public playerNFTs;
    mapping(uint256 => string) public nftMetadata;
    
    IERC20 public cUSD;
    uint256 public totalRewardsDistributed;
    uint256 public totalNFTsMinted;
    
    // Events
    event LevelCompleted(
        address indexed player,
        uint256 levelId,
        uint256 score,
        uint256 cUSDReward,
        uint256 gemReward,
        bool nftMinted
    );
    
    event NFTRewarded(
        address indexed player,
        uint256 tokenId,
        string gemType,
        uint256 rarity
    );
    
    event RewardsUpdated(uint256 levelId, uint256 cUSDReward, uint256 gemReward, uint256 nftChance);
    
    // Modifiers
    modifier validLevel(uint256 levelId) {
        require(levelId > 0 && levelId <= 100, "Invalid level ID");
        require(levelRewards[levelId].isActive, "Level not active");
        _;
    }
    
    modifier validScore(uint256 score) {
        require(score > 0, "Score must be positive");
        _;
    }
    
    constructor(address _cUSD) ERC721("GemCraft NFTs", "GEM") {
        cUSD = IERC20(_cUSD);
        _setupDefaultRewards();
    }
    
    /**
     * @dev Setup default rewards for levels 1-10
     */
    function _setupDefaultRewards() private {
        // Level 1-3: Easy levels
        levelRewards[1] = LevelReward(0.1 ether, 10, 1, true);
        levelRewards[2] = LevelReward(0.2 ether, 20, 2, true);
        levelRewards[3] = LevelReward(0.3 ether, 30, 3, true);
        
        // Level 4-6: Medium levels
        levelRewards[4] = LevelReward(0.5 ether, 50, 5, true);
        levelRewards[5] = LevelReward(0.7 ether, 70, 7, true);
        levelRewards[6] = LevelReward(1.0 ether, 100, 10, true);
        
        // Level 7-10: Hard levels
        levelRewards[7] = LevelReward(1.5 ether, 150, 15, true);
        levelRewards[8] = LevelReward(2.0 ether, 200, 20, true);
        levelRewards[9] = LevelReward(3.0 ether, 300, 30, true);
        levelRewards[10] = LevelReward(5.0 ether, 500, 50, true);
    }
    
    /**
     * @dev Complete a level and claim rewards
     * @param levelId The level completed
     * @param score The score achieved
     * @param targetScore The target score for the level
     */
    function completeLevel(
        uint256 levelId,
        uint256 score,
        uint256 targetScore
    ) external validLevel(levelId) validScore(score) whenNotPaused nonReentrant {
        require(score >= targetScore, "Score below target");
        
        LevelReward memory reward = levelRewards[levelId];
        PlayerStats storage stats = playerStats[msg.sender];
        
        // Calculate rewards based on performance
        uint256 performanceMultiplier = _calculatePerformanceMultiplier(score, targetScore);
        uint256 cUSDReward = (reward.cUSDReward * performanceMultiplier) / 100;
        uint256 gemReward = (reward.gemReward * performanceMultiplier) / 100;
        
        // Transfer cUSD rewards
        if (cUSDReward > 0) {
            require(cUSD.balanceOf(address(this)) >= cUSDReward, "Insufficient contract balance");
            require(cUSD.transfer(msg.sender, cUSDReward), "cUSD transfer failed");
        }
        
        // Update player stats
        stats.totalScore += score;
        stats.levelsCompleted += 1;
        stats.totalRewards += cUSDReward;
        stats.lastPlayTime = block.timestamp;
        
        // Check for NFT reward
        bool nftMinted = false;
        if (reward.nftChance > 0) {
            nftMinted = _tryMintNFT(msg.sender, levelId, score);
            if (nftMinted) {
                stats.nftsMinted += 1;
            }
        }
        
        totalRewardsDistributed += cUSDReward;
        
        emit LevelCompleted(msg.sender, levelId, score, cUSDReward, gemReward, nftMinted);
    }
    
    /**
     * @dev Calculate performance multiplier based on score vs target
     */
    function _calculatePerformanceMultiplier(uint256 score, uint256 targetScore) private pure returns (uint256) {
        if (score >= targetScore * 2) return 200; // 2x for double target
        if (score >= targetScore * 150 / 100) return 150; // 1.5x for 150% target
        if (score >= targetScore * 125 / 100) return 125; // 1.25x for 125% target
        return 100; // Base reward
    }
    
    /**
     * @dev Try to mint an NFT based on chance
     */
    function _tryMintNFT(address player, uint256 levelId, uint256 score) private returns (bool) {
        LevelReward memory reward = levelRewards[levelId];
        
        // Calculate NFT chance based on score performance
        uint256 nftChance = reward.nftChance;
        if (score >= levelRewards[levelId].cUSDReward / 1e18 * 1000) { // Bonus for high scores
            nftChance = nftChance * 2;
        }
        
        // Random number generation (simplified for demo)
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            player,
            levelId,
            score
        ))) % 100;
        
        if (random < nftChance) {
            _mintGemNFT(player, levelId, score);
            return true;
        }
        
        return false;
    }
    
    /**
     * @dev Mint a gem NFT
     */
    function _mintGemNFT(address player, uint256 levelId, uint256 score) private {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Determine gem type and rarity based on level and score
        (string memory gemType, uint256 rarity) = _determineGemType(levelId, score);
        
        // Create metadata URI
        string memory metadataURI = _createMetadataURI(gemType, rarity, levelId, score);
        
        _safeMint(player, tokenId);
        _setTokenURI(tokenId, metadataURI);
        nftMetadata[tokenId] = metadataURI;
        
        playerNFTs[player].push(tokenId);
        totalNFTsMinted += 1;
        
        emit NFTRewarded(player, tokenId, gemType, rarity);
    }
    
    /**
     * @dev Determine gem type and rarity
     */
    function _determineGemType(uint256 levelId, uint256 score) private pure returns (string memory, uint256) {
        // Rarity based on level difficulty
        uint256 rarity;
        if (levelId >= 8) rarity = 4; // Legendary
        else if (levelId >= 6) rarity = 3; // Epic
        else if (levelId >= 4) rarity = 2; // Rare
        else rarity = 1; // Common
        
        // Gem type based on score
        string memory gemType;
        uint256 scoreMod = score % 8;
        if (scoreMod == 0) gemType = "Ruby";
        else if (scoreMod == 1) gemType = "Emerald";
        else if (scoreMod == 2) gemType = "Sapphire";
        else if (scoreMod == 3) gemType = "Diamond";
        else if (scoreMod == 4) gemType = "Amethyst";
        else if (scoreMod == 5) gemType = "Topaz";
        else if (scoreMod == 6) gemType = "Gold";
        else gemType = "Silver";
        
        return (gemType, rarity);
    }
    
    /**
     * @dev Create metadata URI for NFT
     */
    function _createMetadataURI(
        string memory gemType,
        uint256 rarity,
        uint256 levelId,
        uint256 score
    ) private pure returns (string memory) {
        string memory rarityName;
        if (rarity == 4) rarityName = "Legendary";
        else if (rarity == 3) rarityName = "Epic";
        else if (rarity == 2) rarityName = "Rare";
        else rarityName = "Common";
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(abi.encodePacked(
                '{"name":"', gemType, ' Gem (', rarityName, ')",',
                '"description":"A unique gem NFT earned in GemCraft level ', _uint2str(levelId), ' with score ', _uint2str(score), '",',
                '"image":"https://gemcraft.celo.org/nft/', gemType, '-', _uint2str(rarity), '.png",',
                '"attributes":[',
                '{"trait_type":"Gem Type","value":"', gemType, '"},',
                '{"trait_type":"Rarity","value":"', rarityName, '"},',
                '{"trait_type":"Level","value":', _uint2str(levelId), '},',
                '{"trait_type":"Score","value":', _uint2str(score), '}',
                ']}'
            ))
        ));
    }
    
    /**
     * @dev Base64 encode function
     */
    function _base64Encode(bytes memory data) private pure returns (string memory) {
        // Simplified base64 encoding for demo
        return string(data);
    }
    
    /**
     * @dev Convert uint to string
     */
    function _uint2str(uint256 _i) private pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    // Admin functions
    
    /**
     * @dev Update level rewards (only owner)
     */
    function updateLevelRewards(
        uint256 levelId,
        uint256 cUSDReward,
        uint256 gemReward,
        uint256 nftChance,
        bool isActive
    ) external onlyOwner {
        levelRewards[levelId] = LevelReward(cUSDReward, gemReward, nftChance, isActive);
        emit RewardsUpdated(levelId, cUSDReward, gemReward, nftChance);
    }
    
    /**
     * @dev Deposit cUSD to contract (only owner)
     */
    function depositRewards(uint256 amount) external onlyOwner {
        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
    
    /**
     * @dev Withdraw cUSD from contract (only owner)
     */
    function withdrawRewards(uint256 amount) external onlyOwner {
        require(cUSD.transfer(msg.sender, amount), "Transfer failed");
    }
    
    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // View functions
    
    /**
     * @dev Get player's NFT count
     */
    function getPlayerNFTCount(address player) external view returns (uint256) {
        return playerNFTs[player].length;
    }
    
    /**
     * @dev Get player's NFTs
     */
    function getPlayerNFTs(address player) external view returns (uint256[] memory) {
        return playerNFTs[player];
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return cUSD.balanceOf(address(this));
    }
    
    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
