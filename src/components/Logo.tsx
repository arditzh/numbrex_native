import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
}

export const Logo = ({ size = 'medium', showSubtitle = true }: LogoProps) => {
  const logoStyles = size === 'large' ? styles.large : size === 'small' ? styles.small : styles.medium;
  const imageStyles = size === 'large' ? styles.imageLarge : size === 'small' ? styles.imageSmall : styles.imageMedium;
  const subtitleStyles = size === 'large' ? styles.subtitleLarge : size === 'small' ? styles.subtitleSmall : styles.subtitleMedium;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Create a very subtle continuous scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        logoStyles,
        { 
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: scale }
            ]
          }
        ]}
      >
        <Image 
          source={require('../../assets/logo.png')} 
          style={[styles.logoImage, imageStyles]}
          resizeMode="contain"
        />
        
        {showSubtitle && (
          <Text style={[styles.subtitle, subtitleStyles]}>
            Code Cracker Game
          </Text>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    marginBottom: 16,
  },
  subtitle: {
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(100, 116, 139, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  // Size variants
  small: {
    padding: 16,
  },
  medium: {
    padding: 24,
  },
  large: {
    padding: 32,
  },
  imageSmall: {
    width: 64,
    height: 64,
  },
  imageMedium: {
    width: 96,
    height: 96,
  },
  imageLarge: {
    width: 128,
    height: 128,
  },
  subtitleSmall: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  subtitleMedium: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  subtitleLarge: {
    fontSize: 18,
    letterSpacing: 0.6,
  },
});
