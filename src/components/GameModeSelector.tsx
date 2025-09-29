import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { GameMode } from '../utils/gameLogic';
import { Logo } from './Logo';

interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
}

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode) => void;
}

const { width, height } = Dimensions.get('window');

export const GameModeSelector = ({ onModeSelect }: GameModeSelectorProps) => {
  const [cardAnimations] = useState(() => ({
    classic: new Animated.Value(0),
    speed: new Animated.Value(0),
    survival: new Animated.Value(0),
  }));

  const gameModes: GameModeInfo[] = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Progress through levels with limited attempts. Each stage presents a unique challenge.',
      icon: '🎯'
    },
    {
      id: 'speed',
      name: 'Speed',
      description: 'Race against time! Solve as many numbers as possible in 60 seconds. Test your quick thinking.',
      icon: '⚡'
    },
    {
      id: 'survival',
      name: 'Survival',
      description: 'One mistake ends your run. Rewards multiply as you progress - how far can you go?',
      icon: '💀'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Logo size="small" showSubtitle={false} />
      </View>

      <View style={styles.modesContainer}>
        {gameModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeCard]}
            onPress={() => {
              const anim = Animated.sequence([
                Animated.timing(cardAnimations[mode.id], {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: false,
                }),
                Animated.timing(cardAnimations[mode.id], {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: false,
                })
              ]);
              anim.start(() => onModeSelect(mode.id));
            }}
            activeOpacity={0.95}
          >
            <Animated.View style={[{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#3B82F6',
              opacity: cardAnimations[mode.id],
            }]} />
            <View style={styles.modeContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
                <View style={styles.modeDifficulty}>
                  <View style={[styles.difficultyDot, mode.id === 'classic' ? styles.difficultyEasy : mode.id === 'speed' ? styles.difficultyMedium : styles.difficultyHard]} />
                  <Text style={styles.difficultyText}>{mode.id === 'classic' ? 'Beginner Friendly' : mode.id === 'speed' ? 'Intermediate' : 'Advanced'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: Math.min(24, width * 0.06),
    paddingTop: height * 0.07,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: height * 0.08,
    height: height * 0.08,
    justifyContent: 'center',
  },
  modesContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: height * 0.08,
  },

  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Math.min(20, width * 0.048),
    marginBottom: height * 0.02,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    maxWidth: Math.min(360, width * 0.88),
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Math.min(4, height * 0.005),
  },
  iconContainer: {
    width: Math.min(52, width * 0.125),
    height: Math.min(52, width * 0.125),
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.min(18, width * 0.045),
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  modeIcon: {
    fontSize: Math.min(26, width * 0.065),
  },
  modeInfo: {
    flex: 1,
    paddingRight: 8,
    paddingVertical: 3,
  },
  modeName: {
    fontSize: Math.min(18, width * 0.047),
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  modeDescription: {
    fontSize: Math.min(14, width * 0.037),
    color: '#64748B',
    fontWeight: '400',
    lineHeight: Math.min(20, width * 0.052),
    letterSpacing: -0.1,
  },
  infoSection: {
    paddingTop: height * 0.03,
    paddingBottom: height * 0.04,
    paddingHorizontal: 4,
    marginTop: 'auto',
  },
  infoHeader: {
    fontSize: Math.min(15, width * 0.04),
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: height * 0.02,
    textAlign: 'left',
  },
  infoText: {
    fontSize: Math.min(14, width * 0.037),
    color: '#64748B',
    lineHeight: Math.min(20, width * 0.052),
    marginBottom: height * 0.02,
    textAlign: 'left',
  },
  highlightText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  modeDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  difficultyText: {
    fontSize: Math.min(12, width * 0.032),
    color: '#94A3B8',
    fontWeight: '500',
  },
  difficultyEasy: {
    backgroundColor: '#22C55E',
  },
  difficultyMedium: {
    backgroundColor: '#F59E0B',
  },
  difficultyHard: {
    backgroundColor: '#EF4444',
  },
});