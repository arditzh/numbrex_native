import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GuessRowProps {
  guess: string;
  feedback: ('correct' | 'partial' | 'incorrect')[];
  isRevealed: boolean;
  targetLength?: number;
}

export const GuessRow = ({ guess, feedback, isRevealed, targetLength = 3 }: GuessRowProps) => {
  const digits = guess.split('');
  const remainingSlots = Math.max(0, targetLength - digits.length);

  const getDigitStyle = (feedbackType: string) => {
    switch (feedbackType) {
      case 'correct':
        return [styles.digitCell, styles.digitCorrect];
      case 'partial':
        return [styles.digitCell, styles.digitPartial];
      case 'incorrect':
        return [styles.digitCell, styles.digitIncorrect];
      default:
        return [styles.digitCell, styles.digitEmpty];
    }
  };

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => {
        const feedbackType = isRevealed && feedback[index] ? feedback[index] : 'empty';
        
        return (
          <View
            key={index}
            style={getDigitStyle(feedbackType)}
          >
            <Text style={styles.digitText}>{digit}</Text>
          </View>
        );
      })}
      
      {!isRevealed && Array.from({ length: remainingSlots }, (_, index) => (
        <View
          key={`empty-${index}`}
          style={[styles.digitCell, styles.digitEmpty]}
        >
          <Text style={styles.digitText}></Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  digitCell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  digitText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  digitCorrect: {
    backgroundColor: '#22C55E',
    borderColor: '#16A34A',
    shadowColor: '#15803D',
  },
  digitPartial: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
    shadowColor: '#B45309',
  },
  digitIncorrect: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
    shadowColor: '#B91C1C',
  },
  digitEmpty: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOpacity: 0.05,
  },
});
