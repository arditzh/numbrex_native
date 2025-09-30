import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameMode, formatTime } from '../utils/gameLogic';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

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
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(4),
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: 'transparent',
    elevation: 0,
    borderWidth: 0,
  },
  survivalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(2),
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: 'transparent',
    elevation: 0,
    borderWidth: 0,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: scale(2),
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: verticalScale(2),
    margin: 0,
  },
  statValue: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#3B82F6',
    marginBottom: verticalScale(1),
    letterSpacing: -0.3,
    textShadowColor: 'rgba(59, 130, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  statValueAccent: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: verticalScale(1),
    letterSpacing: -0.3,
    textShadowColor: 'rgba(139, 92, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  statLabel: {
    fontSize: moderateScale(8),
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(100, 116, 139, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  stageName: {
    fontSize: moderateScale(7),
    fontWeight: '700',
    marginTop: verticalScale(1),
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  bossLevel: {
    color: '#F59E0B',
    textShadowColor: 'rgba(245, 158, 11, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  normalLevel: {
    color: '#8B5CF6',
    textShadowColor: 'rgba(139, 92, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  urgentTime: {
    color: '#EF4444',
    textShadowColor: 'rgba(239, 68, 68, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  normalTime: {
    color: '#8B5CF6',
    textShadowColor: 'rgba(139, 92, 246, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
