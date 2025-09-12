import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LevelSelectScreenNavigationProp } from '../types/navigation';
import { LevelConfig } from '../types/game';

const { width } = Dimensions.get('window');
const LEVELS_PER_ROW = 3;
const LEVEL_SIZE = (width - 60) / LEVELS_PER_ROW;

// Mock level data - in a real app, this would come from a server or local storage
const MOCK_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Tutorial',
    targetScore: 1000,
    moves: 20,
    description: 'Learn the basics of matching gems',
    unlocked: true,
    stars: 3,
  },
  {
    id: 2,
    name: 'First Steps',
    targetScore: 1500,
    moves: 25,
    description: 'Match gems to reach the target score',
    unlocked: true,
    stars: 2,
  },
  {
    id: 3,
    name: 'Power Up',
    targetScore: 2000,
    moves: 30,
    description: 'Discover your first power-up',
    unlocked: true,
    stars: 1,
  },
  {
    id: 4,
    name: 'Combo Master',
    targetScore: 2500,
    moves: 25,
    description: 'Create amazing combos',
    unlocked: true,
    stars: 0,
  },
  {
    id: 5,
    name: 'Speed Run',
    targetScore: 3000,
    moves: 20,
    timeLimit: 60,
    description: 'Complete the level in 60 seconds',
    unlocked: true,
    stars: 0,
  },
  {
    id: 6,
    name: 'Locked Level',
    targetScore: 3500,
    moves: 30,
    description: 'Complete level 5 to unlock',
    unlocked: false,
    stars: 0,
  },
];

export default function LevelSelectScreen() {
  const navigation = useNavigation<LevelSelectScreenNavigationProp>();
  const [levels, setLevels] = useState<LevelConfig[]>(MOCK_LEVELS);

  const handleLevelPress = (level: LevelConfig) => {
    if (level.unlocked) {
      navigation.navigate('Game', { level });
    }
  };

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i < count && styles.starFilled]}>
          ⭐
        </Text>
      );
    }
    return stars;
  };

  const renderLevel = (level: LevelConfig) => {
    return (
      <TouchableOpacity
        key={level.id}
        style={[
          styles.levelButton,
          !level.unlocked && styles.lockedLevel,
        ]}
        onPress={() => handleLevelPress(level)}
        disabled={!level.unlocked}
      >
        <View style={styles.levelContent}>
          <Text style={[
            styles.levelNumber,
            !level.unlocked && styles.lockedText,
          ]}>
            {level.id}
          </Text>
          
          <Text style={[
            styles.levelName,
            !level.unlocked && styles.lockedText,
          ]}>
            {level.name}
          </Text>
          
          <View style={styles.starsContainer}>
            {renderStars(level.stars)}
          </View>
          
          <Text style={[
            styles.levelDescription,
            !level.unlocked && styles.lockedText,
          ]}>
            {level.description}
          </Text>
          
          <View style={styles.levelStats}>
            <Text style={[
              styles.statText,
              !level.unlocked && styles.lockedText,
            ]}>
              Target: {level.targetScore.toLocaleString()}
            </Text>
            <Text style={[
              styles.statText,
              !level.unlocked && styles.lockedText,
            ]}>
              Moves: {level.moves}
            </Text>
            {level.timeLimit && (
              <Text style={[
                styles.statText,
                !level.unlocked && styles.lockedText,
              ]}>
                Time: {level.timeLimit}s
              </Text>
            )}
          </View>
          
          {!level.unlocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderLevelRow = (levelRow: LevelConfig[]) => {
    return (
      <View key={levelRow[0].id} style={styles.levelRow}>
        {levelRow.map(renderLevel)}
      </View>
    );
  };

  const levelRows = [];
  for (let i = 0; i < levels.length; i += LEVELS_PER_ROW) {
    levelRows.push(levels.slice(i, i + LEVELS_PER_ROW));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Level</Text>
        <Text style={styles.subtitle}>Choose your challenge</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {levelRows.map(renderLevelRow)}
        
        {/* Coming Soon */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonText}>More levels coming soon!</Text>
          <Text style={styles.comingSoonSubtext}>
            Complete all levels to unlock special challenges
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  levelButton: {
    width: LEVEL_SIZE,
    height: LEVEL_SIZE * 1.2,
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lockedLevel: {
    backgroundColor: '#333',
    opacity: 0.6,
  },
  levelContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  levelName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 1,
  },
  starFilled: {
    color: '#FFD700',
  },
  levelDescription: {
    fontSize: 10,
    color: '#a0a0a0',
    textAlign: 'center',
    marginVertical: 5,
  },
  levelStats: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 9,
    color: '#a0a0a0',
    marginVertical: 1,
  },
  lockedText: {
    color: '#666',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 30,
    color: '#fff',
  },
  comingSoonContainer: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
  },
});
