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
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import * as Haptics from 'expo-haptics';
import { GameModeSelector } from './GameModeSelector';
import { GameStats } from './GameStats';
import { GuessRow } from './GuessRow';
import { DigitInput } from './DigitInput';
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
}

const { width } = Dimensions.get('window');

export const NumberGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    target: '',
    currentGuess: [],
    guesses: [],
    gameOver: false,
    won: false,
    stage: 1,
    attempts: 0,
    maxAttempts: 999,
    mode: null,
    score: 0,
    timeRemaining: 60,
    survivalStreak: 0,
    isTimerActive: false,
    speedModeDigits: 3
  });

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputSectionRef = useRef<View>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Timer effect for Speed Mode and Survival Mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isTimerActive && gameState.timeRemaining > 0 && !gameState.gameOver) {
      if ((gameState.mode === 'speed') || (gameState.mode === 'survival')) {
        interval = setInterval(() => {
          setGameState(prev => {
            if (prev.timeRemaining <= 1) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              return {
                ...prev,
                timeRemaining: 0,
                gameOver: true,
                isTimerActive: false
              };
            }
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          });
        }, 1000);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.mode, gameState.isTimerActive, gameState.timeRemaining, gameState.gameOver]);

  // Keyboard event listeners for better input visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        scrollToInput();
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const selectMode = (mode: GameMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGameState(prev => ({
      ...prev,
      mode,
      stage: 1,
      score: 0,
      timeRemaining: mode === 'speed' ? 60 : mode === 'survival' ? 30 : 0,
      survivalStreak: 0,
      isTimerActive: false,
      speedModeDigits: 3
    }));
  };

  const startNewGame = () => {
    if (!gameState.mode) return;
    
    const newStage = 1;
    const config = getStageConfig(newStage, gameState.mode, gameState.speedModeDigits);
    const target = generateTarget(config.digits);
    
    setGameState(prev => ({
      ...prev,
      stage: newStage,
      target,
      currentGuess: [],
      guesses: [],
      gameOver: false,
      won: false,
      attempts: 0,
      maxAttempts: config.maxAttempts,
      timeRemaining: prev.mode === 'speed' ? 60 : prev.mode === 'survival' ? 30 : prev.timeRemaining,
      isTimerActive: prev.mode === 'speed' || prev.mode === 'survival',
      score: 0,
      survivalStreak: 0
    }));
  };

  const nextStage = () => {
    const newStage = gameState.stage + 1;
    
    const newSpeedModeDigits = gameState.mode === 'speed' 
      ? Math.min(gameState.speedModeDigits + 1, 6)
      : gameState.speedModeDigits;
      
    const config = getStageConfig(newStage, gameState.mode!, newSpeedModeDigits);
    const target = generateTarget(config.digits);
    
    setGameState(prev => ({
      ...prev,
      stage: newStage,
      target,
      currentGuess: [],
      guesses: [],
      gameOver: false,
      won: false,
      attempts: 0,
      maxAttempts: config.maxAttempts,
      timeRemaining: prev.mode === 'speed' ? 60 : prev.mode === 'survival' ? 30 : prev.timeRemaining,
      isTimerActive: prev.mode === 'speed' || prev.mode === 'survival',
      speedModeDigits: newSpeedModeDigits
    }));
  };

  useEffect(() => {
    if (gameState.mode && gameState.target === '' && gameState.stage === 1) {
      startNewGame();
    }
  }, [gameState.mode]);

  const submitGuess = () => {
    if (!gameState.mode) return;
    
    // Dismiss keyboard
    Keyboard.dismiss();
    
    const currentGuessString = gameState.currentGuess.join('');
    const currentConfig = getStageConfig(gameState.stage, gameState.mode, gameState.speedModeDigits);
    
    if (currentGuessString.length !== currentConfig.digits) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (!/^\d+$/.test(currentGuessString)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    const feedback = generateFeedback(currentGuessString, gameState.target);
    const newGuess: Guess = { number: currentGuessString, feedback };
    const newAttempts = gameState.attempts + 1;
    
    const isWin = feedback.every(f => f === 'correct');
    const isLoss = !isWin && (!currentConfig.isUnlimited && newAttempts >= gameState.maxAttempts);
    const isGameOver = isWin || isLoss || (gameState.mode === 'speed' && gameState.timeRemaining <= 0);

    let newScore = gameState.score;
    let newSurvivalStreak = gameState.survivalStreak;

    if (isWin) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (gameState.mode === 'speed') {
        newScore += 10 + (gameState.timeRemaining > 50 ? 5 : 0);
      } else if (gameState.mode === 'survival') {
        newSurvivalStreak += 1;
        newScore += 100 * newSurvivalStreak;
      }
    } else if (isLoss) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setGameState(prev => ({
      ...prev,
      guesses: [...prev.guesses, newGuess],
      currentGuess: [],
      attempts: newAttempts,
      gameOver: isGameOver,
      won: isWin,
      score: newScore,
      survivalStreak: newSurvivalStreak,
      timeRemaining: !isWin && prev.mode === 'survival' && !isGameOver ? 30 : prev.timeRemaining
    }));

    // Focus first input after guess submission (if game continues)
    if (!isGameOver) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const backToModeSelection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGameState(prev => ({
      ...prev,
      mode: null,
      stage: 1,
      score: 0,
      timeRemaining: 0,
      survivalStreak: 0,
      isTimerActive: false,
      gameOver: false,
      won: false,
      target: '',
      currentGuess: [],
      guesses: [],
      attempts: 0,
      maxAttempts: 999,
      speedModeDigits: 3
    }));
  };

  const scrollToInput = () => {
    setTimeout(() => {
      if (inputSectionRef.current && scrollViewRef.current) {
        inputSectionRef.current.measureInWindow((x, y, width, height) => {
          const screenHeight = Dimensions.get('window').height;
          const keyboardHeight = Platform.OS === 'ios' ? 350 : 300;
          const availableHeight = screenHeight - keyboardHeight;
          const inputBottom = y + height;
          
          // If input is below the available space, scroll to make it visible
          if (inputBottom > availableHeight) {
            const scrollOffset = inputBottom - availableHeight + 100; // Extra padding
            scrollViewRef.current?.scrollTo({
              y: scrollOffset,
              animated: true
            });
          }
        });
      }
    }, 150);
  };

  const handleDigitChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newCurrentGuess = [...gameState.currentGuess];
    
    const currentConfig = getStageConfig(gameState.stage, gameState.mode!, gameState.speedModeDigits);
    while (newCurrentGuess.length < currentConfig.digits) {
      newCurrentGuess.push('');
    }
    
    newCurrentGuess[index] = digit;
    setGameState(prev => ({ ...prev, currentGuess: newCurrentGuess }));
    
    if (digit && index < currentConfig.digits - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    if (digit) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Scroll to keep input visible
    scrollToInput();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !gameState.currentGuess[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Show mode selector if no mode is selected
  if (!gameState.mode) {
    return <GameModeSelector onModeSelect={selectMode} />;
  }

  const currentConfig = getStageConfig(gameState.stage, gameState.mode, gameState.speedModeDigits);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.fixedHeader}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={backToModeSelection}
              style={styles.headerChangeModeButton}
            >
              <Text style={styles.changeModeText}>← Mode</Text>
            </TouchableOpacity>
            
            <View style={styles.statsContainer}>
              <GameStats 
                stage={gameState.stage}
                stageName={currentConfig.name}
                attempts={gameState.attempts}
                maxAttempts={gameState.maxAttempts}
                digits={currentConfig.digits}
                isUnlimited={currentConfig.isUnlimited}
                mode={gameState.mode}
                score={gameState.score}
                timeRemaining={gameState.timeRemaining}
                survivalStreak={gameState.survivalStreak}
                isBossLevel={currentConfig.isBossLevel}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Previous Attempts Section */}
        {gameState.guesses.length > 0 && (
          <View style={[
            styles.previousAttemptsCard,
            keyboardVisible && styles.previousAttemptsCardKeyboard
          ]}>
            <View style={styles.previousAttemptsHeader}>
              <Text style={styles.previousAttemptsTitle}>Previous Attempts</Text>
              <Text style={styles.previousAttemptsCount}>{gameState.guesses.length} attempt{gameState.guesses.length !== 1 ? 's' : ''}</Text>
            </View>
            <ScrollView 
              ref={scrollViewRef}
              style={styles.previousAttemptsScrollView}
              contentContainerStyle={styles.previousAttemptsScrollContent}
              showsVerticalScrollIndicator={keyboardVisible}
              indicatorStyle="default"
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              <View style={styles.attemptsGrid}>
                {/* Group attempts into rows of 3 */}
                {Array.from({ length: Math.ceil(gameState.guesses.length / 3) }, (_, rowIndex) => (
                  <View key={rowIndex} style={styles.attemptGridRow}>
                    {gameState.guesses.slice(rowIndex * 3, (rowIndex + 1) * 3).map((guess, colIndex) => {
                      const attemptIndex = rowIndex * 3 + colIndex;
                      return (
                        <View key={attemptIndex} style={styles.attemptItem}>
                          <View style={styles.attemptNumber}>
                            <Text style={styles.attemptNumberText}>{attemptIndex + 1}</Text>
                          </View>
                          <View style={styles.attemptGuess}>
                            <GuessRow 
                              guess={guess.number} 
                              feedback={guess.feedback}
                              isRevealed={true}
                              targetLength={currentConfig.digits}
                              isCompact={true}
                            />
                          </View>
                        </View>
                      );
                    })}
                    {/* Fill empty slots in incomplete rows */}
                    {gameState.guesses.slice(rowIndex * 3, (rowIndex + 1) * 3).length < 3 &&
                      Array.from({ length: 3 - gameState.guesses.slice(rowIndex * 3, (rowIndex + 1) * 3).length }, (_, emptyIndex) => (
                        <View key={`empty-${rowIndex}-${emptyIndex}`} style={styles.attemptItemEmpty} />
                      ))
                    }
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Current Input Section - Always Visible */}
        {!gameState.gameOver && (
          <View style={[
            styles.currentInputCard,
            keyboardVisible && styles.currentInputCardKeyboard
          ]}>
            <View style={styles.currentInputHeader}>
              <Text style={styles.currentInputTitle}>Next Guess</Text>
              <Text style={styles.currentInputAttempt}>Attempt {gameState.attempts + 1}</Text>
            </View>
            <View 
              ref={inputSectionRef}
              style={styles.inputSection}
            >
              <View style={styles.inputContainer}>
                {Array.from({ length: currentConfig.digits }, (_, index) => (
                  <DigitInput
                    key={index}
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    index={index}
                    value={gameState.currentGuess[index] || ''}
                    onChangeText={(value) => handleDigitChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    onFocus={() => {
                      setKeyboardVisible(true);
                      setTimeout(() => {
                        scrollToInput();
                      }, 200);
                    }}
                  />
                ))}
              </View>
              
              <View style={styles.tickButtonContainer}>
                <TouchableOpacity 
                  onPress={submitGuess}
                  style={[
                    styles.tickButton,
                    gameState.currentGuess.filter(digit => digit !== '').length !== currentConfig.digits && styles.tickButtonDisabled
                  ]}
                  disabled={gameState.currentGuess.filter(digit => digit !== '').length !== currentConfig.digits}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tickButtonText}>Submit Number</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {gameState.gameOver && (
          <View style={styles.gameOverContainer}>
            {gameState.won ? (
              <View style={styles.winContainer}>
                <Text style={styles.winText}>
                  🎉 Stage {gameState.stage} Complete!
                </Text>
                <TouchableOpacity 
                  onPress={nextStage}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonText}>Next Stage</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loseContainer}>
                <Text style={styles.loseText}>
                  💀 Game Over! Code was: {gameState.target}
                </Text>
                <View style={styles.gameOverButtons}>
                  <TouchableOpacity 
                    onPress={startNewGame}
                    style={styles.tryAgainButton}
                  >
                    <Text style={styles.tryAgainButtonText}>Try Again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={backToModeSelection}
                    style={styles.changeModeButton}
                  >
                    <Text style={styles.changeModeButtonText}>Change Mode</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.legendCard}>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendCorrect]} />
              <Text style={styles.legendText}>Correct</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendPartial]} />
              <Text style={styles.legendText}>Wrong Place</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendIncorrect]} />
              <Text style={styles.legendText}>Wrong</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  fixedHeader: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minHeight: verticalScale(60),
  },
  headerChangeModeButton: {
    backgroundColor: 'transparent',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(8),
    borderRadius: moderateScale(8),
  },
  changeModeText: {
    color: '#64748B',
    fontSize: moderateScale(11),
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flex: 1,
    marginLeft: scale(8),
  },
  statsCard: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  previousAttemptsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    marginHorizontal: scale(16), // Match header card margin
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flex: 1,
    maxHeight: '50%', // Allow more space when keyboard is closed
  },
  previousAttemptsCardKeyboard: {
    maxHeight: '30%', // Reduce height when keyboard is visible
  },
  previousAttemptsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  previousAttemptsTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  previousAttemptsCount: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: '#6B7280',
  },
  previousAttemptsScrollView: {
    flex: 1,
  },
  previousAttemptsScrollContent: {
    padding: scale(8),
    paddingTop: verticalScale(4),
  },
  attemptsGrid: {
    gap: verticalScale(6),
  },
  attemptGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: scale(4),
  },
  attemptItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: scale(2),
  },
  attemptItemEmpty: {
    flex: 1,
    marginHorizontal: scale(2),
  },
  attemptNumber: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(4),
  },
  attemptNumberText: {
    fontSize: moderateScale(9),
    fontWeight: '600',
    color: '#64748B',
  },
  attemptGuess: {
    width: '100%',
    alignItems: 'center',
  },
  currentInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    marginHorizontal: scale(16), // Match header card margin
    marginBottom: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  currentInputCardKeyboard: {
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },
  currentInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  currentInputTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  currentInputAttempt: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: '#6B7280',
  },
  inputSection: {
    alignItems: 'center',
    padding: scale(16),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(16),
  },
  tickButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tickButton: {
    backgroundColor: '#22C55E',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tickButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowColor: '#64748B',
    shadowOpacity: 0.1,
    elevation: 1,
  },
  tickButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  gameOverContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  winContainer: {
    alignItems: 'center',
  },
  winText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  nextButton: {
    backgroundColor: '#22C55E',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    shadowColor: '#22C55E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  loseContainer: {
    alignItems: 'center',
  },
  loseText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  gameOverButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  tryAgainButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tryAgainButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  changeModeButton: {
    flex: 1,
    backgroundColor: '#64748B',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  changeModeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  legendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    marginHorizontal: scale(20),
    marginVertical: verticalScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  legendItem: {
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  legendText: {
    fontSize: moderateScale(10),
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  legendCorrect: {
    backgroundColor: '#22C55E',
  },
  legendPartial: {
    backgroundColor: '#F59E0B',
  },
  legendIncorrect: {
    backgroundColor: '#EF4444',
  },
});
