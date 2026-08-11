import { describe, expect, it } from 'vitest';
import { spellingErrors } from '../data/errors';
import { createInitialState, loadState, recordLearningAnswer, resetState, saveState, STORAGE_KEY } from './storage';

describe('بيانات التقدم والخصوصية', () => {
  it('يحدّث الإحصاءات بعد الإجابة', () => {
    const state = createInitialState();
    const updated = recordLearningAnswer(state, spellingErrors[0], 1, 'جلسة-اختبار');
    expect(updated.progress.totalReviewed).toBe(state.progress.totalReviewed + 1);
    expect(updated.progress.categories['التاء المربوطة والهاء'].firstTryCorrect).toBe(6);
  });

  it('لا يحفظ النص الكامل في localStorage', () => {
    const values = new Map<string, string>();
    const storage = { setItem: (key: string, value: string) => values.set(key, value) };
    saveState(createInitialState(), storage);
    const stored = values.get(STORAGE_KEY) ?? '';
    expect(stored).not.toContain('ذهبت فاطمه إلى المدرسه');
    expect(stored).not.toContain('messages');
    expect(stored).not.toContain('fullText');
  });

  it('لا يحفظ اسمًا شخصيًا في localStorage', () => {
    const values = new Map<string, string>();
    const storage = { setItem: (key: string, value: string) => values.set(key, value) };
    const state = createInitialState();
    state.profile.name = 'اسم شخصي للاختبار';
    saveState(state, storage);
    const stored = values.get(STORAGE_KEY) ?? '';
    expect(stored).not.toContain('اسم شخصي للاختبار');
    expect(JSON.parse(stored).profile.name).toBe('سالم');
  });

  it('يعيد ضبط البيانات التجريبية', () => {
    const reset = resetState(createInitialState());
    expect(reset.progress.totalReviewed).toBe(0);
    expect(reset.progress.words).toEqual({});
    expect(reset.resetNotice).toBe(true);
  });

  it('يفعّل التنبيه الصوتي افتراضيًا للحسابات الجديدة والبيانات القديمة', () => {
    const current = createInitialState();
    expect(current.settings.soundEnabled).toBe(true);

    const legacyState = {
      ...current,
      settings: {
        animations: true,
        reduceMotion: false,
        reviewTime: '19:00',
        watchEnabled: true,
        directCorrection: false,
      },
    };
    const storage = { getItem: () => JSON.stringify(legacyState) };
    expect(loadState(storage).settings.soundEnabled).toBe(true);
  });
});
