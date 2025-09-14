import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { GameState, Position, LevelConfig } from '../types/GameTypes';
import GameBoardComponent from '../components/GameBoard';
import { GameEngine } from '../game/GameEngine';
import { blockchainManager } from '../utils/BlockchainManager';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GameScreenProps {
  route: {
    params: {
      level: LevelConfig;
    };
  };
  navigation: any;
}

const GameScreen: React.FC<GameScreenProps> = ({ route, navigation }) => {
  const { level } = route.params;
  const [gameEngine] = useState(() => {
    const engine = new GameEngine(8, 8, level);
    // Set up blockchain integration (mock or real)
    const contractInteraction = blockchainManager.getContractInteraction();
    engine.setContractInteraction(contractInteraction);
    return engine;
  });
  
  const [gameState, setGameState] = useState<GameState>(() => gameEngine.getGameState());
  const [isAnimating, setIsAnimating] = useState(false);

  // Update game state when engine state changes
  const updateGameState = useCallback(() => {
    setGameState(gameEngine.getGameState());
  }, [gameEngine]);

  // Timer countdown
  useEffect(() => {
    if (!level.timeLimit || gameState.isPaused || gameState.isGameOver) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        } else {
          // Time's up
          navigation.navigate('GameResult', {
            score: prev.score,
            success: prev.score >= prev.targetScore,
            level: level,
          });
          return { ...prev, isGameOver: true };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPaused, gameState.isGameOver, level.timeLimit, navigation, level]);

  // Check win/lose conditions
  useEffect(() => {
    if (gameState.isGameOver) return;

    // Check if target score reached
    if (gameState.score >= gameState.targetScore) {
      navigation.navigate('GameResult', {
        score: gameState.score,
        success: true,
        level: level,
      });
      setGameState(prev => ({ ...prev, isGameOver: true }));
      return;
    }

    // Check if no moves left
    if (gameState.moves <= 0 && gameState.possibleMoves.length === 0) {
      navigation.navigate('GameResult', {
        score: gameState.score,
        success: gameState.score >= gameState.targetScore,
        level: level,
      });
      setGameState(prev => ({ ...prev, isGameOver: true }));
      return;
    }
  }, [gameState.score, gameState.moves, gameState.possibleMoves, gameState.targetScore, navigation, level]);

  const handleGemPress = useCallback((position: Position) => {
    if (isAnimating || gameState.isGameOver || gameState.isPaused) return;

    // Convert Position to x,y coordinates for GameEngine
    const success = gameEngine.selectGem(position.col, position.row);
    
    if (success) {
      setIsAnimating(true);
      updateGameState();
      
      // Reset animation after a delay
      setTimeout(() => {
        updateGameState();
        setIsAnimating(false);
      }, 1000);
    }
  }, [isAnimating, gameState.isGameOver, gameState.isPaused, gameEngine, updateGameState]);

  const handlePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleHint = () => {
    if (gameState.possibleMoves.length > 0) {
      const randomMove = gameState.possibleMoves[Math.floor(Math.random() * gameState.possibleMoves.length)];
      Alert.alert(
        'Hint',
        `Try swapping gems at (${randomMove[0].row + 1}, ${randomMove[0].col + 1}) and (${randomMove[1].row + 1}, ${randomMove[1].col + 1})`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('No Hints', 'No possible moves available. Try shuffling the board.');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return Math.min((gameState.score / gameState.targetScore) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.levelName}>{level.name}</Text>
          <Text style={styles.levelDescription}>{level.description}</Text>
        </View>
        
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseButtonText}>
            {gameState.isPaused ? '▶️' : '⏸️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Game Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{gameState.score.toLocaleString()}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Target</Text>
          <Text style={styles.statValue}>{gameState.targetScore.toLocaleString()}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Moves</Text>
          <Text style={styles.statValue}>{gameState.moves}</Text>
        </View>
        
        {level.timeLimit && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={[styles.statValue, gameState.timeLeft && gameState.timeLeft < 30 ? styles.timeWarning : null]}>
              {formatTime(gameState.timeLeft || 0)}
            </Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getProgressPercentage()}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(getProgressPercentage())}% Complete
        </Text>
      </View>

      {/* Game Board */}
      <View style={styles.gameContainer}>
        <GameBoardComponent
          board={gameState.board}
          onGemPress={handleGemPress}
          selectedGem={gameState.selectedGem}
          possibleMoves={gameState.possibleMoves}
          isAnimating={isAnimating}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleHint}>
          <Text style={styles.actionButtonText}>💡 Hint</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => {
            // Shuffle board logic would go here
            Alert.alert('Shuffle', 'Shuffle feature coming soon!');
          }}
        >
          <Text style={styles.actionButtonText}>🔀 Shuffle</Text>
        </TouchableOpacity>
      </View>

      {/* Pause Overlay */}
      {gameState.isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>Game Paused</Text>
            <TouchableOpacity style={styles.resumeButton} onPress={handlePause}>
              <Text style={styles.resumeButtonText}>Resume Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quitButton} onPress={() => navigation.goBack()}>
              <Text style={styles.quitButtonText}>Quit Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  levelName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelDescription: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
  },
  pauseButton: {
    padding: 8,
  },
  pauseButtonText: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeWarning: {
    color: '#E74C3C',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  progressText: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    backgroundColor: '#2C3E50',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 250,
  },
  pauseTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
    minWidth: 150,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
  },
  quitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;