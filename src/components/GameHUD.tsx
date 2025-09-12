import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface GameHUDProps {
  score: number;
  moves: number;
  targetScore?: number;
  combos: number;
  isPaused: boolean;
}

export function GameHUD({ score, moves, targetScore, combos, isPaused }: GameHUDProps) {
  const progress = targetScore ? Math.min((score / targetScore) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      {/* Top Row - Score and Moves */}
      <View style={styles.topRow}>
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score.toLocaleString()}</Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Moves</Text>
          <Text style={[styles.statValue, moves <= 5 && styles.warningText]}>
            {moves}
          </Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Combos</Text>
          <Text style={[styles.statValue, combos > 0 && styles.comboText]}>
            {combos}x
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {targetScore && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {score.toLocaleString()} / {targetScore.toLocaleString()}
          </Text>
        </View>
      )}

      {/* Paused Indicator */}
      {isPaused && (
        <View style={styles.pausedIndicator}>
          <Text style={styles.pausedText}>⏸️ PAUSED</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213e',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statContainer: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#FF5722',
  },
  comboText: {
    color: '#FFD700',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    color: '#a0a0a0',
    fontSize: 12,
    textAlign: 'center',
  },
  pausedIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  pausedText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
