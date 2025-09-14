// React component that integrates Phaser game with React Native/Expo Web
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PhaserGame } from '../game/PhaserGame';
import { LevelConfig } from '../data/levelRoadmap';

interface PhaserGameComponentProps {
  levelConfig: LevelConfig;
  onGameEnd: (result: GameResult) => void;
  onPause?: () => void;
  onResume?: () => void;
}

interface GameResult {
  success: boolean;
  score: number;
  performance: {
    stars: number;
    completionRate: number;
    score: number;
    moves: number;
    timeLeft: number;
  };
  levelConfig: LevelConfig;
}

const PhaserGameComponent: React.FC<PhaserGameComponentProps> = ({
  levelConfig,
  onGameEnd,
  onPause,
  onResume
}) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<PhaserGame | null>(null);
  const [isGameReady, setIsGameReady] = useState(false);
  const [gameDimensions, setGameDimensions] = useState({
    width: 800,
    height: 600
  });

  useEffect(() => {
    // Calculate game dimensions based on screen size
    const { width, height } = Dimensions.get('window');
    const aspectRatio = 4 / 3;
    
    let gameWidth = width;
    let gameHeight = width / aspectRatio;
    
    if (gameHeight > height * 0.8) {
      gameHeight = height * 0.8;
      gameWidth = gameHeight * aspectRatio;
    }
    
    setGameDimensions({ width: gameWidth, height: gameHeight });
  }, []);

  useEffect(() => {
    if (gameContainerRef.current && !phaserGameRef.current) {
      // Initialize Phaser game
      phaserGameRef.current = new PhaserGame('phaser-game-container', levelConfig);
      
      // Set up game end callback
      phaserGameRef.current.setGameEndCallback((result: GameResult) => {
        onGameEnd(result);
      });
      
      // Initialize the game
      phaserGameRef.current.init();
      setIsGameReady(true);
    }

    return () => {
      // Cleanup
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy();
        phaserGameRef.current = null;
      }
    };
  }, [levelConfig, onGameEnd]);

  useEffect(() => {
    // Handle pause/resume
    const handleVisibilityChange = () => {
      if (document.hidden) {
        phaserGameRef.current?.pause();
        onPause?.();
      } else {
        phaserGameRef.current?.resume();
        onResume?.();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onPause, onResume]);

  const handleRestart = () => {
    if (phaserGameRef.current) {
      phaserGameRef.current.restart(levelConfig);
    }
  };

  const handlePause = () => {
    phaserGameRef.current?.pause();
    onPause?.();
  };

  const handleResume = () => {
    phaserGameRef.current?.resume();
    onResume?.();
  };

  return (
    <View style={styles.container}>
      <div
        id="phaser-game-container"
        ref={gameContainerRef}
        style={{
          width: gameDimensions.width,
          height: gameDimensions.height,
          margin: 'auto',
          border: '2px solid #333',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
      
      {isGameReady && (
        <View style={styles.controls}>
          <button
            onClick={handleRestart}
            style={styles.controlButton}
          >
            Restart
          </button>
          <button
            onClick={handlePause}
            style={styles.controlButton}
          >
            Pause
          </button>
          <button
            onClick={handleResume}
            style={styles.controlButton}
          >
            Resume
          </button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#4a4a4a',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    fontFamily: 'Arial',
  },
});

export default PhaserGameComponent;
