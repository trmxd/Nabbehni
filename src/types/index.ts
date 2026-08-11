export type UserMode = 'child' | 'student' | 'professional';

export type ErrorInteraction =
  | 'replace-character'
  | 'remove-character'
  | 'add-character'
  | 'split-words'
  | 'select-form';

export interface SpellingError {
  id: string;
  incorrect: string;
  correct: string;
  category: string;
  hint: string;
  explanation: string;
  choices?: string[];
  interaction?: ErrorInteraction;
  examples?: string[];
}

export interface Difference {
  type: 'replace' | 'remove' | 'add' | 'split';
  index: number;
  incorrectSpan: string;
  correctSpan: string;
}

export interface DetectedError {
  id: string;
  record: SpellingError;
  start: number;
  end: number;
  matchedText: string;
  replacementText: string;
  difference: Difference;
}

export interface CategoryProgress {
  seen: number;
  attempts: number;
  correct: number;
  firstTryCorrect: number;
}

export interface WordProgress {
  incorrect: string;
  correct: string;
  category: string;
  appearances: number;
  attempts: number;
  correctSessions: string[];
  lastReviewed: string;
  mastered: boolean;
  watchQueued: boolean;
}

export interface LearningProgress {
  totalReviewed: number;
  mastered: number;
  streak: number;
  lastReviewDate: string | null;
  categories: Record<string, CategoryProgress>;
  words: Record<string, WordProgress>;
}

export interface AppSettings {
  animations: boolean;
  soundEnabled: boolean;
  reduceMotion: boolean;
  reviewTime: string;
  watchEnabled: boolean;
  directCorrection: boolean;
}

export interface AppState {
  profile: {
    name: string;
    mode: UserMode;
    onboarded: boolean;
  };
  settings: AppSettings;
  progress: LearningProgress;
  resetNotice?: boolean;
}
