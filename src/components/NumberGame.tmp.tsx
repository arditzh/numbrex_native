import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameModeSelector } from './GameModeSelector';
import { GameStats } from './GameStats';
import { GuessRow } from './GuessRow';
import { DigitInput } from './DigitInput';
import { Onboarding } from './Onboarding';
import {
  GameMode,
  Guess,
  getStageConfig,
  generateTarget,
  generateFeedback
} from '../utils/gameLogic';

interface GameState {
  target: string;
  currentGuess: string[];
  guesses: Guess[];
  gameOver: boolean;
  won: boolean;
  stage: number;
  attempts: number;
  maxAttempts: number;
  mode: GameMode | null;
  score: number;
  timeRemaining: number;
  survivalStreak: number;
  isTimerActive: boolean;
  speedModeDigits: number;
  isLoading: boolean;
  hasSeenTutorial: boolean;
}

export const NumberGame: React.FC = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Component refs
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputSectionRef = useRef<View>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    target: '',
    currentGuess: [],
    guesses: [],
    gameOver: false,
    won: false,
    stage: 1,
    attempts: 0,
    maxAttempts: 10,
    mode: null,
    score: 0,
    timeRemaining: 0,
    survivalStreak: 0,
    isTimerActive: false,
    speedModeDigits: 4,
    isLoading: true,
    hasSeenTutorial: false
  });

  // Check tutorial status on mount
  useEffect(() => {
    checkTutorialStatus();
  }, []);

  // Handle tutorial status
  const checkTutorialStatus = async () => {
    try {
      const hasSeenTutorial = await AsyncStorage.getItem('hasSeenTutorial');
      setGameState(prev => ({ ...prev, hasSeenTutorial: !!hasSeenTutorial, isLoading: false }));
    } catch (error) {
      console.error('Error checking tutorial status:', error);
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTutorial', 'true');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setGameState(prev => ({ ...prev, hasSeenTutorial: true }));
    } catch (error) {
      console.error('Error saving tutorial status:', error);
    }
  };

  // Animation handlers
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Loading state
  if (gameState.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Show tutorial for first-time users
  if (!gameState.hasSeenTutorial) {
    return <Onboarding onComplete={handleTutorialComplete} />;
  }

  // Show mode selector if no mode is selected
  if (!gameState.mode) {
    return <GameModeSelector onModeSelect={selectMode} />;
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <GameStats
            attempts={gameState.attempts}
            maxAttempts={gameState.maxAttempts}
            won={gameState.won}
            gameOver={gameState.gameOver}
          />

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.guessContainer}>
              {gameState.guesses.map((guess, index) => (
                <GuessRow
                  key={index}
                  guess={guess.number}
                  feedback={guess.feedback}
                  isRevealed={true}
                  targetLength={gameState.target.length}
                />
              ))}
            </View>

            <View ref={inputSectionRef} style={styles.inputSection}>
              <DigitInput
                value={gameState.currentGuess}
                onChangeDigit={handleDigitInput}
                refs={inputRefs}
                disabled={gameState.gameOver}
              />

              <Animated.View style={[
                styles.buttonContainer,
                { transform: [{ scale: buttonScaleAnim }] }
              ]}>
                <TouchableOpacity
                  style={[styles.guessButton, gameState.gameOver && styles.disabledButton]}
                  onPress={handleGuess}
                  disabled={gameState.gameOver}
                >
                  <Text style={styles.guessButtonText}>Make Guess</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  guessContainer: {
    marginVertical: 20,
  },
  inputSection: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  guessButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  guessButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});