import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GameScreenRouteProp, GameScreenNavigationProp } from '../types/navigation';
import { useGame } from '../game/GameContext';
import { GameBoard } from '../components/GameBoard';
import { GameHUD } from '../components/GameHUD';
import { LevelConfig } from '../types/game';

const { width, height } = Dimensions.get('window');

export default function GameScreen() {
  const route = useRoute<GameScreenRouteProp>();
  const navigation = useNavigation<GameScreenNavigationProp>();
  const { gameEngine, gameState, initializeGame, selectGem, pauseGame, resumeGame } = useGame();
  const [isPaused, setIsPaused] = useState(false);

  const { level } = route.params;

  useEffect(() => {
    if (!gameEngine) {
      initializeGame(level);
    }
  }, [gameEngine, initializeGame, level]);

  const handleGemPress = (x: number, y: number) => {
    if (gameState?.isPaused || gameState?.isGameOver) return;
    
    const success = selectGem(x, y);
    if (!success) {
      // Could add haptic feedback here
      console.log('Invalid move');
    }
  };

  const handlePause = () => {
    if (isPaused) {
      resumeGame();
      setIsPaused(false);
    } else {
      pauseGame();
      setIsPaused(true);
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Exit Game',
      'Are you sure you want to exit? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleGameOver = () => {
    if (gameState?.isGameOver) {
      const score = gameState.score;
      const targetScore = gameState.targetScore || 0;
      const success = score >= targetScore;

      Alert.alert(
        success ? 'Level Complete!' : 'Game Over',
        `Score: ${score}\nTarget: ${targetScore}`,
        [
          { text: 'Play Again', onPress: () => initializeGame(level) },
          { text: 'Level Select', onPress: () => navigation.navigate('LevelSelect') },
          { text: 'Home', onPress: () => navigation.navigate('Home') },
        ]
      );
    }
  };

  useEffect(() => {
    if (gameState?.isGameOver) {
      handleGameOver();
    }
  }, [gameState?.isGameOver]);

  if (!gameState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.levelTitle}>Level {level.id}</Text>
        
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseButtonText}>
            {isPaused ? '▶️' : '⏸️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Game HUD */}
      <GameHUD 
        score={gameState.score}
        moves={gameState.moves}
        targetScore={gameState.targetScore}
        combos={gameState.combos}
        isPaused={gameState.isPaused}
      />

      {/* Game Board */}
      <View style={styles.gameContainer}>
        <GameBoard
          board={gameState.board}
          onGemPress={handleGemPress}
          selectedGem={gameState.selectedGem}
        />
      </View>

      {/* Pause Overlay */}
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseContent}>
            <Text style={styles.pauseTitle}>Game Paused</Text>
            <TouchableOpacity style={styles.resumeButton} onPress={handlePause}>
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleBack}>
              <Text style={styles.menuButtonText}>Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Game Over Overlay */}
      {gameState.isGameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverContent}>
            <Text style={styles.gameOverTitle}>
              {gameState.score >= (gameState.targetScore || 0) ? 'Level Complete!' : 'Game Over'}
            </Text>
            <Text style={styles.finalScore}>Score: {gameState.score}</Text>
            {gameState.targetScore && (
              <Text style={styles.targetScore}>Target: {gameState.targetScore}</Text>
            )}
            <View style={styles.gameOverButtons}>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => initializeGame(level)}
              >
                <Text style={styles.retryButtonText}>Play Again</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={() => navigation.navigate('LevelSelect')}
              >
                <Text style={styles.nextButtonText}>Level Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#16213e',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseButton: {
    padding: 10,
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  pauseContent: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  pauseTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#666',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContent: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: width * 0.8,
  },
  gameOverTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  finalScore: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  targetScore: {
    color: '#a0a0a0',
    fontSize: 18,
    marginBottom: 30,
  },
  gameOverButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 0.45,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 0.45,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
