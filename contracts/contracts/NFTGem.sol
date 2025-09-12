// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFTGem
 * @dev ERC-721 NFTs for rare gems and power-ups in GemCraft
 * @notice This contract manages the minting of gem NFTs as rewards
 */
contract NFTGem is ERC721, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    // Base URI for metadata
    string private _baseTokenURI;
    
    // Maximum supply
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Gem types and rarities
    enum GemType { Ruby, Sapphire, Emerald, Diamond, Amethyst, Topaz, Special }
    enum Rarity { Common, Rare, Epic, Legendary }
    enum Power { Normal, RowClear, ColumnClear, Explosive, ColorBomb }

    struct GemData {
        GemType gemType;
        Rarity rarity;
        Power power;
        uint256 level;
        uint256 mintedAt;
    }

    // Token ID to gem data mapping
    mapping(uint256 => GemData) public gemData;
    
    // Player to token IDs mapping
    mapping(address => uint256[]) public playerTokens;
    
    // Rarity to mint price (in wei)
    mapping(Rarity => uint256) public mintPrices;
    
    // Events
    event GemMinted(
        address indexed to,
        uint256 indexed tokenId,
        GemType gemType,
        Rarity rarity,
        Power power
    );
    event GemDataUpdated(uint256 indexed tokenId, GemData gemData);
    event MintPriceUpdated(Rarity rarity, uint256 newPrice);

    constructor(string memory baseURI) ERC721("GemCraft Gems", "GEM") {
        _baseTokenURI = baseURI;
        
        // Set initial mint prices (in wei)
        mintPrices[Rarity.Common] = 0; // Free for common gems
        mintPrices[Rarity.Rare] = 1e17; // 0.1 cUSD
        mintPrices[Rarity.Epic] = 5e17; // 0.5 cUSD
        mintPrices[Rarity.Legendary] = 2e18; // 2 cUSD
    }

    /**
     * @dev Mint a gem NFT to a player
     * @param to The address to mint to
     * @param gemType The type of gem
     * @param rarity The rarity of the gem
     * @param power The power of the gem
     * @param level The level requirement
     */
    function mintGem(
        address to,
        GemType gemType,
        Rarity rarity,
        Power power,
        uint256 level
    ) external onlyOwner nonReentrant whenNotPaused returns (uint256) {
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        gemData[tokenId] = GemData({
            gemType: gemType,
            rarity: rarity,
            power: power,
            level: level,
            mintedAt: block.timestamp
        });
        
        playerTokens[to].push(tokenId);
        
        emit GemMinted(to, tokenId, gemType, rarity, power);
        
        return tokenId;
    }

    /**
     * @dev Batch mint multiple gems
     * @param to The address to mint to
     * @param gemTypes Array of gem types
     * @param rarities Array of rarities
     * @param powers Array of powers
     * @param levels Array of levels
     */
    function batchMintGems(
        address to,
        GemType[] calldata gemTypes,
        Rarity[] calldata rarities,
        Power[] calldata powers,
        uint256[] calldata levels
    ) external onlyOwner nonReentrant whenNotPaused {
        require(
            gemTypes.length == rarities.length &&
            rarities.length == powers.length &&
            powers.length == levels.length,
            "Arrays length mismatch"
        );
        
        require(_tokenIdCounter.current() + gemTypes.length <= MAX_SUPPLY, "Max supply exceeded");
        
        for (uint256 i = 0; i < gemTypes.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(to, tokenId);
            
            gemData[tokenId] = GemData({
                gemType: gemTypes[i],
                rarity: rarities[i],
                power: powers[i],
                level: levels[i],
                mintedAt: block.timestamp
            });
            
            playerTokens[to].push(tokenId);
            
            emit GemMinted(to, tokenId, gemTypes[i], rarities[i], powers[i]);
        }
    }

    /**
     * @dev Mint gem with signature verification
     * @param to The address to mint to
     * @param gemType The type of gem
     * @param rarity The rarity of the gem
     * @param power The power of the gem
     * @param level The level requirement
     * @param signature Server signature for verification
     */
    function mintGemWithSignature(
        address to,
        GemType gemType,
        Rarity rarity,
        Power power,
        uint256 level,
        bytes calldata signature
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        
        // Verify signature (simplified for demo)
        require(verifyMintSignature(to, gemType, rarity, power, level, signature), "Invalid signature");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        gemData[tokenId] = GemData({
            gemType: gemType,
            rarity: rarity,
            power: power,
            level: level,
            mintedAt: block.timestamp
        });
        
        playerTokens[to].push(tokenId);
        
        emit GemMinted(to, tokenId, gemType, rarity, power);
        
        return tokenId;
    }

    /**
     * @dev Get all tokens owned by a player
     * @param player The player address
     * @return Array of token IDs
     */
    function getPlayerTokens(address player) external view returns (uint256[] memory) {
        return playerTokens[player];
    }

    /**
     * @dev Get gem data for a token
     * @param tokenId The token ID
     * @return GemData struct
     */
    function getGemData(uint256 tokenId) external view returns (GemData memory) {
        require(_exists(tokenId), "Token does not exist");
        return gemData[tokenId];
    }

    /**
     * @dev Get gems by rarity
     * @param player The player address
     * @param rarity The rarity to filter by
     * @return Array of token IDs
     */
    function getGemsByRarity(address player, Rarity rarity) external view returns (uint256[] memory) {
        uint256[] memory tokens = playerTokens[player];
        uint256 count = 0;
        
        // Count matching gems
        for (uint256 i = 0; i < tokens.length; i++) {
            if (gemData[tokens[i]].rarity == rarity) {
                count++;
            }
        }
        
        // Create result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < tokens.length; i++) {
            if (gemData[tokens[i]].rarity == rarity) {
                result[index] = tokens[i];
                index++;
            }
        }
        
        return result;
    }

    /**
     * @dev Get gems by type
     * @param player The player address
     * @param gemType The gem type to filter by
     * @return Array of token IDs
     */
    function getGemsByType(address player, GemType gemType) external view returns (uint256[] memory) {
        uint256[] memory tokens = playerTokens[player];
        uint256 count = 0;
        
        // Count matching gems
        for (uint256 i = 0; i < tokens.length; i++) {
            if (gemData[tokens[i]].gemType == gemType) {
                count++;
            }
        }
        
        // Create result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < tokens.length; i++) {
            if (gemData[tokens[i]].gemType == gemType) {
                result[index] = tokens[i];
                index++;
            }
        }
        
        return result;
    }

    // Admin functions
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function updateMintPrice(Rarity rarity, uint256 newPrice) external onlyOwner {
        mintPrices[rarity] = newPrice;
        emit MintPriceUpdated(rarity, newPrice);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Override functions
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        GemData memory gem = gemData[tokenId];
        
        return string(abi.encodePacked(
            _baseURI(),
            "gem/",
            tokenId.toString(),
            "?type=", uint256(gem.gemType).toString(),
            "&rarity=", uint256(gem.rarity).toString(),
            "&power=", uint256(gem.power).toString(),
            "&level=", gem.level.toString()
        ));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Update player tokens mapping when transferring
        if (from != address(0) && to != address(0)) {
            // Remove from sender's tokens
            uint256[] storage senderTokens = playerTokens[from];
            for (uint256 i = 0; i < senderTokens.length; i++) {
                if (senderTokens[i] == tokenId) {
                    senderTokens[i] = senderTokens[senderTokens.length - 1];
                    senderTokens.pop();
                    break;
                }
            }
            
            // Add to receiver's tokens
            playerTokens[to].push(tokenId);
        }
    }

    // Signature verification (simplified for demo)
    function verifyMintSignature(
        address to,
        GemType gemType,
        Rarity rarity,
        Power power,
        uint256 level,
        bytes calldata signature
    ) internal pure returns (bool) {
        // In production, implement proper signature verification
        // For demo purposes, we'll accept any signature
        return signature.length > 0;
    }

    // View functions
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getMintPrice(Rarity rarity) external view returns (uint256) {
        return mintPrices[rarity];
    }
}
