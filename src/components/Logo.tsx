import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
}

export const Logo = ({ size = 'medium', showSubtitle = true }: LogoProps) => {
  const logoStyles = size === 'large' ? styles.large : size === 'small' ? styles.small : styles.medium;
  const imageStyles = size === 'large' ? styles.imageLarge : size === 'small' ? styles.imageSmall : styles.imageMedium;
  const subtitleStyles = size === 'large' ? styles.subtitleLarge : size === 'small' ? styles.subtitleSmall : styles.subtitleMedium;

  return (
    <View style={[styles.container, logoStyles]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={[styles.logoImage, imageStyles]}
          resizeMode="contain"
        />
        
        {showSubtitle && (
          <Text style={[styles.subtitle, subtitleStyles]}>Code Cracker Game</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
    fontWeight: '400',
    textAlign: 'center',
  },
  // Size variants
  small: {
    padding: 12,
  },
  medium: {
    padding: 20,
  },
  large: {
    padding: 32,
  },
  imageSmall: {
    width: 80,
    height: 80,
  },
  imageMedium: {
    width: 120,
    height: 120,
  },
  imageLarge: {
    width: 160,
    height: 160,
  },
  subtitleSmall: {
    fontSize: 10,
  },
  subtitleMedium: {
    fontSize: 14,
  },
  subtitleLarge: {
    fontSize: 16,
  },
});
