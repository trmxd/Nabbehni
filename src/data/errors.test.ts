import { describe, expect, it } from 'vitest';
import { commonSpellingErrors, spellingErrors } from './errors';
import { pickRandomWritingExample, writingExamples } from './writingExamples';
import { applyCorrection, compareWords, detectErrors, isCorrectChoice } from '../utils/detector';

describe('قاعدة الأخطاء الموسعة', () => {
  it('تحتوي على مئة كلمة شائعة بلا تكرار', () => {
    expect(commonSpellingErrors).toHaveLength(100);
    expect(new Set(commonSpellingErrors.map((record) => record.incorrect)).size).toBe(100);
    expect(spellingErrors.length).toBeGreaterThanOrEqual(100);
  });

  it('يكتشف كل كلمة شائعة ويطبق تصحيحها المحدد', () => {
    commonSpellingErrors.forEach((record) => {
      const source = `جرّب ${record.incorrect} الآن`;
      const detected = detectErrors(source).find((item) => item.record.id === record.id);
      expect(detected, record.incorrect).toBeDefined();
      expect(applyCorrection(source, detected!), record.incorrect).toContain(record.correct);
    });
  });

  it('يوفر إجابة صحيحة قابلة للاختيار لكل سجل', () => {
    commonSpellingErrors.forEach((record) => {
      const correctChoice = record.interaction === 'remove-character'
        ? 'remove'
        : record.interaction === 'select-form'
          ? record.correct
          : compareWords(record.incorrect, record.correct, record.interaction).correctSpan;
      expect(record.choices ?? [correctChoice], record.incorrect).toContain(correctChoice);
      expect(isCorrectChoice(record, correctChoice), record.incorrect).toBe(true);
    });
  });

  it('يعرض عشرة أمثلة جاهزة وكل مثال يحتوي كلمة قابلة للمراجعة', () => {
    expect(writingExamples).toHaveLength(10);
    writingExamples.forEach((example) => expect(detectErrors(example.text).length, example.id).toBeGreaterThan(0));
  });

  it('يختار مثالًا عشوائيًا من العشرة من دون تكرار المثال الحالي', () => {
    const current = writingExamples[0];
    expect(pickRandomWritingExample(current.text, () => 0).text).not.toBe(current.text);
    expect(writingExamples).toContain(pickRandomWritingExample(current.text, () => 0.999));
  });
});
