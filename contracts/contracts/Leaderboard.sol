// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Leaderboard
 * @dev On-chain leaderboard for GemCraft game scores
 * @notice This contract stores and manages player scores and rankings
 */
contract Leaderboard is Ownable, ReentrancyGuard, Pausable {
    
    struct ScoreEntry {
        address player;
        uint256 score;
        uint256 level;
        uint256 timestamp;
        bool exists;
    }
    
    struct PlayerStats {
        uint256 bestScore;
        uint256 bestLevel;
        uint256 totalGames;
        uint256 totalScore;
        uint256 lastPlayed;
    }
    
    // Global leaderboard (top 100)
    ScoreEntry[] public globalLeaderboard;
    uint256 public constant MAX_LEADERBOARD_SIZE = 100;
    
    // Player statistics
    mapping(address => PlayerStats) public playerStats;
    
    // Events
    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        uint256 level,
        uint256 rank
    );
    event LeaderboardUpdated(uint256 newSize);
    event PlayerStatsUpdated(address indexed player, PlayerStats stats);
    
    constructor() {
        // Initialize empty leaderboard
    }
    
    /**
     * @dev Submit a score to the leaderboard
     * @param score The score achieved
     * @param level The level reached
     */
    function submitScore(uint256 score, uint256 level) external nonReentrant whenNotPaused {
        require(score > 0, "Score must be greater than 0");
        require(level > 0, "Level must be greater than 0");
        
        address player = msg.sender;
        
        // Update player stats
        PlayerStats storage stats = playerStats[player];
        stats.totalGames++;
        stats.totalScore += score;
        stats.lastPlayed = block.timestamp;
        
        if (score > stats.bestScore) {
            stats.bestScore = score;
        }
        
        if (level > stats.bestLevel) {
            stats.bestLevel = level;
        }
        
        emit PlayerStatsUpdated(player, stats);
        
        // Check if score qualifies for leaderboard
        if (globalLeaderboard.length < MAX_LEADERBOARD_SIZE || 
            score > globalLeaderboard[globalLeaderboard.length - 1].score) {
            
            // Add to leaderboard
            ScoreEntry memory newEntry = ScoreEntry({
                player: player,
                score: score,
                level: level,
                timestamp: block.timestamp,
                exists: true
            });
            
            // Insert in correct position
            uint256 insertIndex = findInsertPosition(score);
            
            if (globalLeaderboard.length < MAX_LEADERBOARD_SIZE) {
                // Add to end and sort
                globalLeaderboard.push(newEntry);
                sortLeaderboard();
            } else {
                // Replace lowest score
                globalLeaderboard[MAX_LEADERBOARD_SIZE - 1] = newEntry;
                sortLeaderboard();
            }
            
            uint256 rank = getPlayerRank(player);
            emit ScoreSubmitted(player, score, level, rank);
            emit LeaderboardUpdated(globalLeaderboard.length);
        }
    }
    
    /**
     * @dev Batch submit scores (for admin use)
     * @param players Array of player addresses
     * @param scores Array of scores
     * @param levels Array of levels
     */
    function batchSubmitScores(
        address[] calldata players,
        uint256[] calldata scores,
        uint256[] calldata levels
    ) external onlyOwner nonReentrant whenNotPaused {
        require(
            players.length == scores.length && scores.length == levels.length,
            "Arrays length mismatch"
        );
        
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            uint256 score = scores[i];
            uint256 level = levels[i];
            
            require(score > 0, "Score must be greater than 0");
            require(level > 0, "Level must be greater than 0");
            
            // Update player stats
            PlayerStats storage stats = playerStats[player];
            stats.totalGames++;
            stats.totalScore += score;
            stats.lastPlayed = block.timestamp;
            
            if (score > stats.bestScore) {
                stats.bestScore = score;
            }
            
            if (level > stats.bestLevel) {
                stats.bestLevel = level;
            }
            
            // Check if score qualifies for leaderboard
            if (globalLeaderboard.length < MAX_LEADERBOARD_SIZE || 
                score > globalLeaderboard[globalLeaderboard.length - 1].score) {
                
                ScoreEntry memory newEntry = ScoreEntry({
                    player: player,
                    score: score,
                    level: level,
                    timestamp: block.timestamp,
                    exists: true
                });
                
                if (globalLeaderboard.length < MAX_LEADERBOARD_SIZE) {
                    globalLeaderboard.push(newEntry);
                } else {
                    globalLeaderboard[MAX_LEADERBOARD_SIZE - 1] = newEntry;
                }
            }
        }
        
        sortLeaderboard();
        emit LeaderboardUpdated(globalLeaderboard.length);
    }
    
    /**
     * @dev Get the current leaderboard
     * @return Array of ScoreEntry structs
     */
    function getLeaderboard() external view returns (ScoreEntry[] memory) {
        return globalLeaderboard;
    }
    
    /**
     * @dev Get top N players
     * @param count Number of top players to return
     * @return Array of ScoreEntry structs
     */
    function getTopPlayers(uint256 count) external view returns (ScoreEntry[] memory) {
        require(count <= globalLeaderboard.length, "Count exceeds leaderboard size");
        
        ScoreEntry[] memory topPlayers = new ScoreEntry[](count);
        for (uint256 i = 0; i < count; i++) {
            topPlayers[i] = globalLeaderboard[i];
        }
        
        return topPlayers;
    }
    
    /**
     * @dev Get player's rank in the leaderboard
     * @param player The player address
     * @return Rank (1-based) or 0 if not in leaderboard
     */
    function getPlayerRank(address player) public view returns (uint256) {
        for (uint256 i = 0; i < globalLeaderboard.length; i++) {
            if (globalLeaderboard[i].player == player) {
                return i + 1;
            }
        }
        return 0;
    }
    
    /**
     * @dev Get player's best score entry
     * @param player The player address
     * @return ScoreEntry struct or empty if not found
     */
    function getPlayerBestScore(address player) external view returns (ScoreEntry memory) {
        for (uint256 i = 0; i < globalLeaderboard.length; i++) {
            if (globalLeaderboard[i].player == player) {
                return globalLeaderboard[i];
            }
        }
        
        // Return empty entry if not found
        return ScoreEntry({
            player: address(0),
            score: 0,
            level: 0,
            timestamp: 0,
            exists: false
        });
    }
    
    /**
     * @dev Get leaderboard size
     * @return Current number of entries
     */
    function getLeaderboardSize() external view returns (uint256) {
        return globalLeaderboard.length;
    }
    
    /**
     * @dev Get player statistics
     * @param player The player address
     * @return PlayerStats struct
     */
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    /**
     * @dev Get players around a specific rank
     * @param rank The rank to center around
     * @param range Number of players above and below to include
     * @return Array of ScoreEntry structs
     */
    function getPlayersAroundRank(uint256 rank, uint256 range) external view returns (ScoreEntry[] memory) {
        require(rank > 0 && rank <= globalLeaderboard.length, "Invalid rank");
        
        uint256 start = rank > range ? rank - range - 1 : 0;
        uint256 end = rank + range < globalLeaderboard.length ? rank + range : globalLeaderboard.length;
        uint256 count = end - start;
        
        ScoreEntry[] memory players = new ScoreEntry[](count);
        for (uint256 i = 0; i < count; i++) {
            players[i] = globalLeaderboard[start + i];
        }
        
        return players;
    }
    
    // Internal functions
    function findInsertPosition(uint256 score) internal view returns (uint256) {
        for (uint256 i = 0; i < globalLeaderboard.length; i++) {
            if (score > globalLeaderboard[i].score) {
                return i;
            }
        }
        return globalLeaderboard.length;
    }
    
    function sortLeaderboard() internal {
        // Simple bubble sort (can be optimized for production)
        for (uint256 i = 0; i < globalLeaderboard.length - 1; i++) {
            for (uint256 j = 0; j < globalLeaderboard.length - i - 1; j++) {
                if (globalLeaderboard[j].score < globalLeaderboard[j + 1].score) {
                    ScoreEntry memory temp = globalLeaderboard[j];
                    globalLeaderboard[j] = globalLeaderboard[j + 1];
                    globalLeaderboard[j + 1] = temp;
                }
            }
        }
    }
    
    // Admin functions
    function clearLeaderboard() external onlyOwner {
        delete globalLeaderboard;
        emit LeaderboardUpdated(0);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // View functions
    function getLeaderboardInfo() external view returns (
        uint256 size,
        uint256 maxSize,
        uint256 totalPlayers
    ) {
        return (
            globalLeaderboard.length,
            MAX_LEADERBOARD_SIZE,
            // Note: This would require tracking unique players
            globalLeaderboard.length
        );
    }
}
