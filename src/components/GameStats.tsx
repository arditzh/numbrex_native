import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameMode, formatTime } from '../utils/gameLogic';

interface GameStatsProps {
  stage: number;
  stageName: string;
  attempts: number;
  maxAttempts: number;
  digits: number;
  isUnlimited?: boolean;
  mode: GameMode;
  score: number;
  timeRemaining: number;
  survivalStreak: number;
  isBossLevel?: boolean;
}

export const GameStats = ({ 
  stage, 
  stageName, 
  attempts, 
  maxAttempts, 
  digits, 
  isUnlimited, 
  mode, 
  score, 
  timeRemaining, 
  survivalStreak,
  isBossLevel 
}: GameStatsProps) => {
  if (mode === 'speed') {
    return (
      <View style={styles.container}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{score}</Text>
          <Text style={styles.statLabel}>SCORE</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[
            styles.statValue, 
            timeRemaining <= 10 ? styles.urgentTime : styles.normalTime
          ]}>
            {formatTime(timeRemaining)}
          </Text>
          <Text style={styles.statLabel}>TIME</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{digits}</Text>
          <Text style={styles.statLabel}>DIGITS</Text>
        </View>
      </View>
    );
  }

  if (mode === 'survival') {
    return (
      <View style={styles.survivalContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{survivalStreak}</Text>
          <Text style={styles.statLabel}>STREAK</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[
            styles.statValue, 
            timeRemaining <= 10 ? styles.urgentTime : styles.normalTime
          ]}>
            {formatTime(timeRemaining)}
          </Text>
          <Text style={styles.statLabel}>TIME</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{`${attempts}/5`}</Text>
          <Text style={styles.statLabel}>ATTEMPTS</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{digits}</Text>
          <Text style={styles.statLabel}>DIGITS</Text>
        </View>
      </View>
    );
  }

  // Classic mode
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stage}</Text>
        <Text style={styles.statLabel}>STAGE</Text>
        <Text style={[
          styles.stageName,
          isBossLevel ? styles.bossLevel : styles.normalLevel
        ]}>
          {isBossLevel ? '👑 ' + stageName : stageName}
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statValueAccent}>{digits}</Text>
        <Text style={styles.statLabel}>DIGITS</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          {isUnlimited ? attempts : `${attempts}/${maxAttempts}`}
        </Text>
        <Text style={styles.statLabel}>
          {isUnlimited ? "UNLIMITED" : "ATTEMPTS"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  survivalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    margin: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3B82F6',
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(59, 130, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statValueAccent: {
    fontSize: 26,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(139, 92, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(100, 116, 139, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  stageName: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bossLevel: {
    color: '#F59E0B',
    textShadowColor: 'rgba(245, 158, 11, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  normalLevel: {
    color: '#8B5CF6',
    textShadowColor: 'rgba(139, 92, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  urgentTime: {
    color: '#EF4444',
    textShadowColor: 'rgba(239, 68, 68, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  normalTime: {
    color: '#8B5CF6',
    textShadowColor: 'rgba(139, 92, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
