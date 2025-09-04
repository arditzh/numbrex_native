import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

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
    width: 52,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    fontSize: 20,
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
