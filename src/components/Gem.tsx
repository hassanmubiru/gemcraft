import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Gem as GemType, GemType as GemTypeEnum, SpecialGemType } from '../types/GameTypes';

interface GemProps {
  gem: GemType;
  size: number;
  onPress: () => void;
  isSelected: boolean;
  isHighlighted: boolean;
  animation?: Animated.Value;
}

const Gem: React.FC<GemProps> = ({
  gem,
  size,
  onPress,
  isSelected,
  isHighlighted,
  animation
}) => {
  const getGemColor = (type: GemTypeEnum): string => {
    switch (type) {
      case GemTypeEnum.RUBY:
        return '#E74C3C';
      case GemTypeEnum.EMERALD:
        return '#2ECC71';
      case GemTypeEnum.SAPPHIRE:
        return '#3498DB';
      case GemTypeEnum.DIAMOND:
        return '#ECF0F1';
      case GemTypeEnum.AMETHYST:
        return '#9B59B6';
      case GemTypeEnum.TOPAZ:
        return '#F39C12';
      case GemTypeEnum.GOLD:
        return '#F1C40F';
      case GemTypeEnum.SILVER:
        return '#BDC3C7';
      default:
        return '#95A5A6';
    }
  };

  const getGemSymbol = (type: GemTypeEnum): string => {
    switch (type) {
      case GemTypeEnum.RUBY:
        return '💎';
      case GemTypeEnum.EMERALD:
        return '💚';
      case GemTypeEnum.SAPPHIRE:
        return '💙';
      case GemTypeEnum.DIAMOND:
        return '💠';
      case GemTypeEnum.AMETHYST:
        return '💜';
      case GemTypeEnum.TOPAZ:
        return '🧡';
      case GemTypeEnum.GOLD:
        return '🟡';
      case GemTypeEnum.SILVER:
        return '⚪';
      default:
        return '💎';
    }
  };

  const getSpecialSymbol = (specialType: SpecialGemType): string => {
    switch (specialType) {
      case SpecialGemType.BOMB:
        return '💣';
      case SpecialGemType.LIGHTNING:
        return '⚡';
      case SpecialGemType.RAINBOW:
        return '🌈';
      case SpecialGemType.MULTIPLIER:
        return '✨';
      case SpecialGemType.ROW_CLEAR:
        return '➡️';
      case SpecialGemType.COLUMN_CLEAR:
        return '⬇️';
      case SpecialGemType.EXPLOSIVE:
        return '💥';
      case SpecialGemType.COLOR_BOMB:
        return '🎆';
      default:
        return '⭐';
    }
  };

  const gemColor = getGemColor(gem.type);
  const gemSymbol = getGemSymbol(gem.type);
  const specialSymbol = gem.isSpecial && gem.specialType ? getSpecialSymbol(gem.specialType) : null;

  const animatedStyle = animation ? {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1]
        })
      }
    ]
  } : {};

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.gem,
          {
            width: size,
            height: size,
            backgroundColor: gemColor,
            borderColor: isSelected ? '#FFFFFF' : isHighlighted ? '#F39C12' : 'transparent',
            borderWidth: isSelected ? 3 : isHighlighted ? 2 : 0,
            shadowColor: gemColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.gemContent}>
          <Text style={[styles.gemSymbol, { fontSize: size * 0.4 }]}>
            {gemSymbol}
          </Text>
          {specialSymbol && (
            <Text style={[styles.specialSymbol, { fontSize: size * 0.3 }]}>
              {specialSymbol}
            </Text>
          )}
        </View>
        
        {/* Gem shine effect */}
        <View style={styles.shine} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gem: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gemContent: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gemSymbol: {
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  specialSymbol: {
    position: 'absolute',
    top: -2,
    right: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  shine: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: '30%',
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
  },
});

export default Gem;
