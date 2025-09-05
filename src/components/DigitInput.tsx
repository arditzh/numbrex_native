import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, TextInputProps, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface DigitInputProps extends TextInputProps {
  index: number;
}

export const DigitInput = forwardRef<TextInput, DigitInputProps>(
  ({ index, style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        maxLength={1}
        keyboardType="numeric"
        textAlign="center"
        selectTextOnFocus
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    width: Math.min(48, (width - 80) / 7), // More space for digits and tick button
    height: Math.min(48, (width - 80) / 7),
    minWidth: 32,
    minHeight: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    fontSize: Math.min(18, width * 0.04),
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
