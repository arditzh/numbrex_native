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
    gap: 10,
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  digitCell: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  digitText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  digitCorrect: {
    backgroundColor: '#22C55E',
    borderColor: '#16A34A',
    shadowColor: '#22C55E',
  },
  digitPartial: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
    shadowColor: '#F59E0B',
  },
  digitIncorrect: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
    shadowColor: '#EF4444',
  },
  digitEmpty: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOpacity: 0.05,
  },
});
