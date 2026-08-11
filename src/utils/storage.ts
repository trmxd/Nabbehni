import type { AppState, LearningProgress, SpellingError, UserMode } from '../types';

export const STORAGE_KEY = 'nabbehni-learning-v1';

export const emptyProgress = (): LearningProgress => ({
  totalReviewed: 0,
  mastered: 0,
  streak: 0,
  lastReviewDate: null,
  categories: {},
  words: {},
});

const seedProgress = (): LearningProgress => ({
  totalReviewed: 18,
  mastered: 7,
  streak: 4,
  lastReviewDate: 'بيانات تجريبية',
  categories: {
    'التاء المربوطة والهاء': { seen: 8, attempts: 11, correct: 7, firstTryCorrect: 5 },
    'الهمزات': { seen: 5, attempts: 7, correct: 4, firstTryCorrect: 3 },
    'الألف الزائدة': { seen: 3, attempts: 4, correct: 3, firstTryCorrect: 2 },
    'الفصل والوصل': { seen: 2, attempts: 3, correct: 2, firstTryCorrect: 1 },
  },
  words: {
    'مدرسه': {
      incorrect: 'مدرسه', correct: 'مدرسة', category: 'التاء المربوطة والهاء', appearances: 3,
      attempts: 4, correctSessions: ['تجربة-1', 'تجربة-2'], lastReviewed: 'بيانات تجريبية', mastered: false, watchQueued: true,
    },
    'فاطمه': {
      incorrect: 'فاطمه', correct: 'فاطمة', category: 'التاء المربوطة والهاء', appearances: 2,
      attempts: 2, correctSessions: ['تجربة-1'], lastReviewed: 'بيانات تجريبية', mastered: false, watchQueued: false,
    },
  },
});

export function createInitialState(): AppState {
  return {
    profile: { name: 'سالم', mode: 'child', onboarded: false },
    settings: {
      animations: true,
      soundEnabled: true,
      reduceMotion: false,
      reviewTime: '19:00',
      watchEnabled: true,
      directCorrection: false,
    },
    progress: seedProgress(),
  };
}

function isSafeState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AppState>;
  return Boolean(candidate.profile && candidate.settings && candidate.progress);
}

export function loadState(storage: Pick<Storage, 'getItem'> = localStorage): AppState {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed: unknown = JSON.parse(raw);
    if (!isSafeState(parsed)) return createInitialState();
    const defaults = createInitialState();
    return {
      ...defaults,
      ...parsed,
      profile: { ...defaults.profile, ...parsed.profile, name: 'سالم' },
      settings: { ...defaults.settings, ...parsed.settings },
      progress: parsed.progress,
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState, storage: Pick<Storage, 'setItem'> = localStorage): void {
  const safeState: AppState = {
    profile: { ...state.profile, name: 'سالم' },
    settings: state.settings,
    progress: state.progress,
    resetNotice: state.resetNotice,
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(safeState));
}

export function resetState(current: AppState): AppState {
  return {
    ...current,
    progress: emptyProgress(),
    resetNotice: true,
  };
}

export function updateProfileState(state: AppState, _name: string, mode: UserMode): AppState {
  return { ...state, profile: { name: 'سالم', mode, onboarded: true }, resetNotice: false };
}

export function recordLearningAnswer(
  state: AppState,
  record: SpellingError,
  attemptsUsed: number,
  sessionId: string,
): AppState {
  const category = state.progress.categories[record.category] ?? { seen: 0, attempts: 0, correct: 0, firstTryCorrect: 0 };
  const previousWord = state.progress.words[record.incorrect];
  const sessions = previousWord?.correctSessions.includes(sessionId)
    ? previousWord.correctSessions
    : [...(previousWord?.correctSessions ?? []), sessionId];
  const appearances = (previousWord?.appearances ?? 0) + 1;
  const mastered = sessions.length >= 3;
  const words = {
    ...state.progress.words,
    [record.incorrect]: {
      incorrect: record.incorrect,
      correct: record.correct,
      category: record.category,
      appearances,
      attempts: (previousWord?.attempts ?? 0) + attemptsUsed,
      correctSessions: sessions,
      lastReviewed: new Date().toISOString().slice(0, 10),
      mastered,
      watchQueued: appearances >= 3 && !mastered,
    },
  };

  return {
    ...state,
    resetNotice: false,
    progress: {
      ...state.progress,
      totalReviewed: state.progress.totalReviewed + 1,
      mastered: state.progress.mastered + (mastered && !previousWord?.mastered ? 1 : 0),
      streak: Math.max(1, state.progress.streak),
      lastReviewDate: new Date().toISOString().slice(0, 10),
      categories: {
        ...state.progress.categories,
        [record.category]: {
          seen: category.seen + 1,
          attempts: category.attempts + attemptsUsed,
          correct: category.correct + 1,
          firstTryCorrect: category.firstTryCorrect + (attemptsUsed === 1 ? 1 : 0),
        },
      },
      words,
    },
  };
}
