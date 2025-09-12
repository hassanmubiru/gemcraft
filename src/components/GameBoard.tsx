import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { GameBoard as GameBoardType, Gem } from '../types/game';
import { GemComponent } from './GemComponent';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 350);
const CELL_SIZE = BOARD_SIZE / 8;

interface GameBoardProps {
  board: GameBoardType;
  onGemPress: (x: number, y: number) => void;
  selectedGem: Gem | null;
}

export function GameBoard({ board, onGemPress, selectedGem }: GameBoardProps) {
  const renderGem = (gem: Gem, x: number, y: number) => {
    const isSelected = selectedGem?.id === gem.id;
    
    return (
      <TouchableOpacity
        key={gem.id}
        style={[
          styles.gemContainer,
          isSelected && styles.selectedGem,
        ]}
        onPress={() => onGemPress(x, y)}
        activeOpacity={0.7}
      >
        <GemComponent gem={gem} size={CELL_SIZE - 4} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {board.gems.map((row, y) =>
          row.map((gem, x) => renderGem(gem, x, y))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gemContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGem: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
});
