export type GameMode = 'classic' | 'speed' | 'survival';

export interface Guess {
  number: string;
  feedback: ('correct' | 'partial' | 'incorrect')[];
}

export interface StageConfig {
  digits: number;
  maxAttempts: number;
  name: string;
  description: string;
  isUnlimited?: boolean;
  isBossLevel?: boolean;
}

export const getStageConfig = (stage: number, mode: GameMode, speedModeDigits?: number): StageConfig => {
  const isBossLevel = stage % 10 === 0; // Every 10th level is a boss level
  
  if (mode === 'speed') {
    // In speed mode, digits are determined by speedModeDigits state, not stage
    const digits = Math.min(speedModeDigits || 3, 6); // Cap at 6 digits max
    return { digits, maxAttempts: 999, name: "Speed", description: "Race against time", isUnlimited: true };
  }
  
  if (mode === 'survival') {
    const digits = Math.min(2 + stage, 6); // Stage 1=3 digits, Stage 2=4 digits, etc.
    return { digits, maxAttempts: 5, name: "Survival", description: "5 attempts, 30s each" };
  }
  
  // Classic mode
  if (stage === 1) {
    return { digits: 3, maxAttempts: 999, name: "Easy", description: "Learn the basics", isUnlimited: true };
  } else if (stage >= 2 && stage <= 3) {
    return { 
      digits: 3, 
      maxAttempts: 6, 
      name: "Easy", 
      description: "3-digit codes"
    };
  } else if (stage >= 4 && stage <= 6) {
    return { 
      digits: 4, 
      maxAttempts: isBossLevel ? 9 : 7, 
      name: isBossLevel ? "Boss Medium" : "Medium", 
      description: "4-digit codes",
      isBossLevel 
    };
  } else if (stage >= 7 && stage <= 9) {
    return { 
      digits: 5, 
      maxAttempts: isBossLevel ? 10 : 8, 
      name: isBossLevel ? "Boss Hard" : "Hard", 
      description: "5-digit codes",
      isBossLevel 
    };
  } else if (stage >= 10 && stage <= 14) {
    return { 
      digits: 4, 
      maxAttempts: isBossLevel ? 6 : 4, 
      name: isBossLevel ? "Boss Challenge" : "Challenge", 
      description: "4-digit codes - Limited attempts",
      isBossLevel 
    };
  } else if (stage >= 15 && stage <= 19) {
    return { 
      digits: 5, 
      maxAttempts: isBossLevel ? 5 : 3, 
      name: isBossLevel ? "Boss Extreme" : "Extreme", 
      description: "5-digit codes - Very limited attempts",
      isBossLevel 
    };
  } else if (stage >= 20 && stage <= 30) {
    return { 
      digits: 6, 
      maxAttempts: isBossLevel ? 4 : 2, 
      name: isBossLevel ? "Boss Master" : "Master", 
      description: "6-digit codes - Minimal attempts",
      isBossLevel 
    };
  } else if (stage >= 31 && stage <= 60) {
    return { 
      digits: 6, 
      maxAttempts: isBossLevel ? 3 : 2, 
      name: isBossLevel ? "Boss Legendary" : "Legendary", 
      description: "6-digit codes - Ultimate challenge",
      isBossLevel 
    };
  } else {
    return { 
      digits: 6, 
      maxAttempts: isBossLevel ? 3 : 2, 
      name: isBossLevel ? "Boss Impossible" : "Impossible", 
      description: "6-digit codes - Perfect precision required",
      isBossLevel 
    };
  }
};

export const generateTarget = (digits: number): string => {
  const availableDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let target = '';
  
  for (let i = 0; i < digits; i++) {
    const randomIndex = Math.floor(Math.random() * availableDigits.length);
    target += availableDigits[randomIndex].toString();
    availableDigits.splice(randomIndex, 1); // Remove used digit to ensure uniqueness
  }
  
  return target;
};

export const generateFeedback = (guess: string, target: string): ('correct' | 'partial' | 'incorrect')[] => {
  const feedback: ('correct' | 'partial' | 'incorrect')[] = [];
  const targetDigits = target.split('');
  const guessDigits = guess.split('');

  for (let i = 0; i < guessDigits.length; i++) {
    if (guessDigits[i] === targetDigits[i]) {
      feedback.push('correct');
    } else if (targetDigits.includes(guessDigits[i])) {
      feedback.push('partial');
    } else {
      feedback.push('incorrect');
    }
  }

  return feedback;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
