import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { GameBoard as GameBoardType, Position, Gem, Match } from '../types/GameTypes';
import GemComponent from './Gem';

interface GameBoardProps {
  board: GameBoardType;
  onGemPress: (position: Position) => void;
  selectedGem?: Position;
  possibleMoves: Position[][];
  isAnimating: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const BOARD_PADDING = 20;
const BOARD_SIZE = screenWidth - (BOARD_PADDING * 2);

const GameBoardComponent: React.FC<GameBoardProps> = ({
  board,
  onGemPress,
  selectedGem,
  possibleMoves,
  isAnimating
}) => {
  const [animations, setAnimations] = useState<{ [key: string]: Animated.Value }>({});
  const animationRefs = useRef<{ [key: string]: Animated.Value }>({});

  const gemSize = BOARD_SIZE / board.cols;
  const boardHeight = gemSize * board.rows;

  // Initialize animations for each gem
  useEffect(() => {
    const newAnimations: { [key: string]: Animated.Value } = {};
    board.gems.forEach((row, rowIndex) => {
      row.forEach((gem, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        if (!animationRefs.current[key]) {
          animationRefs.current[key] = new Animated.Value(1);
        }
        newAnimations[key] = animationRefs.current[key];
      });
    });
    setAnimations(newAnimations);
  }, [board.gems]);

  const isGemSelected = (position: Position): boolean => {
    return selectedGem?.row === position.row && selectedGem?.col === position.col;
  };

  const isGemHighlighted = (position: Position): boolean => {
    return possibleMoves.some(move => 
      move.some(pos => pos.row === position.row && pos.col === position.col)
    );
  };

  const animateGem = (position: Position, type: 'select' | 'deselect' | 'match' | 'swap') => {
    const key = `${position.row}-${position.col}`;
    const animation = animationRefs.current[key];
    
    if (!animation) return;

    switch (type) {
      case 'select':
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      case 'deselect':
        Animated.timing(animation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
        break;
      case 'match':
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      case 'swap':
        Animated.timing(animation, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(animation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
        break;
    }
  };

  // Animate gem selection
  useEffect(() => {
    if (selectedGem) {
      animateGem(selectedGem, 'select');
    }
  }, [selectedGem]);

  const renderGem = (gem: Gem, rowIndex: number, colIndex: number) => {
    const position: Position = { row: rowIndex, col: colIndex };
    const key = `${rowIndex}-${colIndex}`;
    const animation = animations[key];

    return (
      <View
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.gemContainer,
          {
            width: gemSize,
            height: gemSize,
          }
        ]}
      >
        <GemComponent
          gem={gem}
          size={gemSize - 4} // Small gap between gems
          onPress={() => onGemPress(position)}
          isSelected={isGemSelected(position)}
          isHighlighted={isGemHighlighted(position)}
          animation={animation}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.board, { width: BOARD_SIZE, height: boardHeight }]}>
        {board.gems.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((gem, colIndex) => renderGem(gem, rowIndex, colIndex))}
          </View>
        ))}
      </View>
      
      {/* Grid overlay for visual reference */}
      <View style={[styles.gridOverlay, { width: BOARD_SIZE, height: boardHeight }]} pointerEvents="none">
        {Array.from({ length: board.rows }).map((_, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.gridRow}>
            {Array.from({ length: board.cols }).map((_, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.gridCell,
                  {
                    width: gemSize,
                    height: gemSize,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: BOARD_PADDING,
  },
  board: {
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
  },
  gemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    top: BOARD_PADDING,
    left: BOARD_PADDING,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default GameBoardComponent;