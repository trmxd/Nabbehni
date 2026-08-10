import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppSettings, AppState, SpellingError, UserMode } from '../types';
import { unlockErrorSound } from '../utils/errorSound';
import {
  loadState,
  recordLearningAnswer,
  resetState,
  saveState,
  updateProfileState,
} from '../utils/storage';

interface AppStateContextValue {
  state: AppState;
  updateProfile: (name: string, mode: UserMode) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  recordAnswer: (record: SpellingError, attempts: number, sessionId: string) => void;
  resetProgress: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
    document.documentElement.dataset.mode = state.profile.mode;
    document.documentElement.classList.toggle('reduce-motion', state.settings.reduceMotion || !state.settings.animations);
  }, [state]);

  useEffect(() => {
    const unlock = () => unlockErrorSound();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const value = useMemo<AppStateContextValue>(() => ({
    state,
    updateProfile: (name, mode) => setState((current) => updateProfileState(current, name, mode)),
    updateSettings: (settings) => setState((current) => ({
      ...current,
      settings: { ...current.settings, ...settings },
      resetNotice: false,
    })),
    recordAnswer: (record, attempts, sessionId) => {
      setState((current) => recordLearningAnswer(current, record, attempts, sessionId));
    },
    resetProgress: () => setState((current) => resetState(current)),
  }), [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('يجب استخدام حالة التطبيق داخل المزوّد.');
  return context;
}
