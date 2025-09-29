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
    width: Math.min(56, (width - 80) / 6),
    height: Math.min(56, (width - 80) / 6),
    minWidth: 40,
    minHeight: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    fontSize: Math.min(24, width * 0.05),
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
});
