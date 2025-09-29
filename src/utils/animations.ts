import { Animated } from 'react-native';

export const animateScale = (scaleAnim: Animated.Value, onComplete?: () => void) => {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};

export const animateFade = (fadeAnim: Animated.Value, toValue: number, duration: number = 300) => {
  Animated.timing(fadeAnim, {
    toValue,
    duration,
    useNativeDriver: true,
  }).start();
};

export const createAnimatedStyle = (scaleAnim: Animated.Value) => ({
  transform: [{ scale: scaleAnim }],
});