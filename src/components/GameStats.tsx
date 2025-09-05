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
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  survivalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  statValueAccent: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },
  stageName: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  bossLevel: {
    color: '#F59E0B',
  },
  normalLevel: {
    color: '#8B5CF6',
  },
  urgentTime: {
    color: '#EF4444',
  },
  normalTime: {
    color: '#8B5CF6',
  },
});
