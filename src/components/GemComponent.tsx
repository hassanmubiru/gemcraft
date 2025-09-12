import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gem, GemType, GemPower } from '../types/game';

interface GemComponentProps {
  gem: Gem;
  size: number;
}

export function GemComponent({ gem, size }: GemComponentProps) {
  const getGemColor = (type: GemType): string => {
    switch (type) {
      case 'ruby':
        return '#E91E63';
      case 'sapphire':
        return '#2196F3';
      case 'emerald':
        return '#4CAF50';
      case 'diamond':
        return '#FFFFFF';
      case 'amethyst':
        return '#9C27B0';
      case 'topaz':
        return '#FF9800';
      case 'special':
        return '#FFD700';
      default:
        return '#666';
    }
  };

  const getGemSymbol = (type: GemType): string => {
    switch (type) {
      case 'ruby':
        return '💎';
      case 'sapphire':
        return '💙';
      case 'emerald':
        return '💚';
      case 'diamond':
        return '💠';
      case 'amethyst':
        return '💜';
      case 'topaz':
        return '🧡';
      case 'special':
        return '⭐';
      default:
        return '💎';
    }
  };

  const getPowerSymbol = (power: GemPower): string => {
    switch (power) {
      case 'normal':
        return '';
      case 'row_clear':
        return '➡️';
      case 'column_clear':
        return '⬇️';
      case 'explosive':
        return '💥';
      case 'color_bomb':
        return '🌈';
      default:
        return '';
    }
  };

  const gemColor = getGemColor(gem.type);
  const gemSymbol = getGemSymbol(gem.type);
  const powerSymbol = getPowerSymbol(gem.power);

  return (
    <View
      style={[
        styles.gem,
        {
          width: size,
          height: size,
          backgroundColor: gemColor,
          borderRadius: size / 4,
        },
        gem.isMatched && styles.matchedGem,
        gem.isAnimating && styles.animatingGem,
      ]}
    >
      <Text style={[styles.gemSymbol, { fontSize: size * 0.4 }]}>
        {gemSymbol}
      </Text>
      {powerSymbol && (
        <Text style={[styles.powerSymbol, { fontSize: size * 0.2 }]}>
          {powerSymbol}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gem: {
    justifyContent: 'center',
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
  matchedGem: {
    opacity: 0.5,
    transform: [{ scale: 0.8 }],
  },
  animatingGem: {
    transform: [{ scale: 1.1 }],
  },
  gemSymbol: {
    textAlign: 'center',
  },
  powerSymbol: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
});
