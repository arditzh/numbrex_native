import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
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
        <Text style={styles.headerText}>Choose your game mode:</Text>
        {gameModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={styles.modeCard}
            onPress={() => onModeSelect(mode.id)}
            activeOpacity={0.95}
          >
            <View style={styles.modeContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
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
    paddingTop: height * 0.06,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: height * 0.05,
    height: height * 0.08,
    justifyContent: 'center',
  },
  modesContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: height * 0.06,
  },
  headerText: {
    fontSize: Math.min(15, width * 0.04),
    fontWeight: '600',
    color: '#64748B',
    marginBottom: height * 0.02,
    textAlign: 'left',
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Math.min(18, width * 0.045),
    marginBottom: height * 0.018,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: '100%',
    maxWidth: Math.min(360, width * 0.88),
    alignSelf: 'center',
  },
  modeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Math.min(4, height * 0.005),
  },
  iconContainer: {
    width: Math.min(48, width * 0.115),
    height: Math.min(48, width * 0.115),
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.min(16, width * 0.04),
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeIcon: {
    fontSize: Math.min(24, width * 0.06),
  },
  modeInfo: {
    flex: 1,
    paddingRight: 6,
    paddingVertical: 2,
  },
  modeName: {
    fontSize: Math.min(17, width * 0.045),
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  modeDescription: {
    fontSize: Math.min(14, width * 0.037),
    color: '#64748B',
    fontWeight: '400',
    lineHeight: Math.min(19, width * 0.05),
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
});