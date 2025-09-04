import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  Dimensions 
} from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={backToModeSelection}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Change Mode</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsCard}>
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

      <View style={styles.gameCard}>
        <View style={styles.guessesContainer}>
          {gameState.guesses.map((guess, index) => (
            <GuessRow 
              key={index} 
              guess={guess.number} 
              feedback={guess.feedback}
              isRevealed={true}
              targetLength={currentConfig.digits}
            />
          ))}
        </View>

        {!gameState.gameOver && (
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              {Array.from({ length: currentConfig.digits }, (_, index) => (
                <DigitInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  index={index}
                  value={gameState.currentGuess[index] || ''}
                  onChangeText={(value) => handleDigitChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                />
              ))}
            </View>
            
            <TouchableOpacity 
              onPress={submitGuess}
              style={[
                styles.submitButton,
                gameState.currentGuess.filter(digit => digit !== '').length !== currentConfig.digits && styles.submitButtonDisabled
              ]}
              disabled={gameState.currentGuess.filter(digit => digit !== '').length !== currentConfig.digits}
            >
              <Text style={styles.submitButtonText}>Submit Guess</Text>
            </TouchableOpacity>
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
      </View>

      <View style={styles.legendCard}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDigit, styles.legendCorrect]}>
            <Text style={styles.legendSymbol}>✓</Text>
          </View>
          <Text style={styles.legendText}>Correct digit, correct position</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDigit, styles.legendPartial]}>
            <Text style={styles.legendSymbol}>?</Text>
          </View>
          <Text style={styles.legendText}>Correct digit, wrong position</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDigit, styles.legendIncorrect]}>
            <Text style={styles.legendSymbol}>✗</Text>
          </View>
          <Text style={styles.legendText}>Wrong digit</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  guessesContainer: {
    marginBottom: 28,
    minHeight: 60,
  },
  inputSection: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowColor: '#64748B',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
    borderRadius: 20,
    padding: 20,
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
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  legendDigit: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  legendSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  legendText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    fontWeight: '500',
    lineHeight: 18,
  },
  legendCorrect: {
    backgroundColor: '#22C55E',
    borderColor: '#16A34A',
  },
  legendPartial: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  legendIncorrect: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
});
