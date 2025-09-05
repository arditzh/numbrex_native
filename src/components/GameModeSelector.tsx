import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { GameMode } from '../utils/gameLogic';
import { Logo } from './Logo';

interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  details: string[];
}

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode) => void;
}

const { width, height } = Dimensions.get('window');

export const GameModeSelector = ({ onModeSelect }: GameModeSelectorProps) => {
  const gameModes: GameModeInfo[] = [
    {
      id: 'classic',
      name: 'Classic Mode',
      description: 'Traditional gameplay with attempts',
      icon: '🎯',
      details: [
        '6 attempts per standard level',
        '8-10 attempts for boss levels',
        'No time pressure',
        'Progress through 60+ stages'
      ]
    },
    {
      id: 'speed',
      name: 'Speed Mode',
      description: 'Solve as many as possible in 60 seconds',
      icon: '⚡',
      details: [
        '60 second time limit',
        'Unlimited attempts per number',
        'Score based on numbers solved',
        'Quick succession gameplay'
      ]
    },
    {
      id: 'survival',
      name: 'Survival Mode',
      description: 'One mistake ends your run',
      icon: '💀',
      details: [
        'One wrong guess = game over',
        'Multiplying rewards',
        'Increasing difficulty',
        'High-risk, high-reward'
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Logo size="medium" showSubtitle={false} />
      </View>
      

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {gameModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={styles.modeCard}
            onPress={() => onModeSelect(mode.id)}
            activeOpacity={0.7}
          >
            <View style={styles.modeContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
              </View>
              
              <View style={styles.modeInfo}>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </View>
              
              <View style={styles.modeDetails}>
                {mode.details.map((detail, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => onModeSelect(mode.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.playButtonText}>Play {mode.name}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modeContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  modeIcon: {
    fontSize: 40,
  },
  modeInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  modeDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 22,
  },
  modeDetails: {
    width: '100%',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    color: '#3B82F6',
    fontSize: 18,
    marginRight: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  detailText: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
    lineHeight: 20,
    fontWeight: '400',
  },
  playButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
