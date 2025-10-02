import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import * as Haptics from 'expo-haptics';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

export const NumericKeypad = ({ onKeyPress, onBackspace, disabled = false }: NumericKeypadProps) => {
  const handleKeyPress = (key: string) => {
    if (disabled) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onKeyPress(key);
  };

  const handleBackspace = () => {
    if (disabled) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onBackspace();
  };

  const KeypadButton = ({ digit, onPress, style = {} }: { digit: string; onPress: () => void; style?: object }) => (
    <TouchableOpacity
      style={[styles.keypadButton, disabled && styles.keypadButtonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.keypadButtonText, disabled && styles.keypadButtonTextDisabled]}>
        {digit}
      </Text>
    </TouchableOpacity>
  );

  const BackspaceButton = () => (
    <TouchableOpacity
      style={[styles.keypadButton, styles.backspaceButton, disabled && styles.keypadButtonDisabled]}
      onPress={handleBackspace}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.backspaceButtonText, disabled && styles.keypadButtonTextDisabled]}>
        ⌫
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.keypadContainer}>
        {/* Row 1: 1, 2, 3 */}
        <View style={styles.keypadRow}>
          <KeypadButton digit="1" onPress={() => handleKeyPress('1')} />
          <KeypadButton digit="2" onPress={() => handleKeyPress('2')} />
          <KeypadButton digit="3" onPress={() => handleKeyPress('3')} />
        </View>

        {/* Row 2: 4, 5, 6 */}
        <View style={styles.keypadRow}>
          <KeypadButton digit="4" onPress={() => handleKeyPress('4')} />
          <KeypadButton digit="5" onPress={() => handleKeyPress('5')} />
          <KeypadButton digit="6" onPress={() => handleKeyPress('6')} />
        </View>

        {/* Row 3: 7, 8, 9 */}
        <View style={styles.keypadRow}>
          <KeypadButton digit="7" onPress={() => handleKeyPress('7')} />
          <KeypadButton digit="8" onPress={() => handleKeyPress('8')} />
          <KeypadButton digit="9" onPress={() => handleKeyPress('9')} />
        </View>

        {/* Row 4: Backspace, 0, Submit (placeholder) */}
        <View style={styles.keypadRow}>
          <BackspaceButton />
          <KeypadButton digit="0" onPress={() => handleKeyPress('0')} />
          <View style={styles.keypadButton} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(4),
    paddingHorizontal: scale(12),
  },
  keypadContainer: {
    alignItems: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(8),
    marginBottom: verticalScale(4),
  },
  keypadButton: {
    width: scale(50),
    height: verticalScale(40),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  keypadButtonDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  keypadButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  keypadButtonTextDisabled: {
    color: '#9CA3AF',
  },
  backspaceButton: {
    backgroundColor: '#FEF3F2',
    borderColor: '#FECACA',
  },
  backspaceButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#DC2626',
  },
});