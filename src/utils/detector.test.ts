import { describe, expect, it } from 'vitest';
import { applyCorrection, detectErrors } from './detector';

describe('محرك اكتشاف الأخطاء', () => {
  it('يكتشف مدرسه', () => {
    const result = detectErrors('ذهبت إلى المدرسه');
    expect(result).toHaveLength(1);
    expect(result[0].record.incorrect).toBe('مدرسه');
  });

  it('يقترح مدرسة بعد محاولة المستخدم', () => {
    const text = 'هذه مدرسه جميلة';
    const detected = detectErrors(text)[0];
    expect(detected.record.correct).toBe('مدرسة');
    expect(applyCorrection(text, detected)).toBe('هذه مدرسة جميلة');
  });

  it('يكتشف هاذا والحرف الزائد', () => {
    const detected = detectErrors('هاذا كتاب')[0];
    expect(detected.record.correct).toBe('هذا');
    expect(detected.difference.type).toBe('remove');
  });

  it('يكتشف الى حتى مع علامات الترقيم المحيطة', () => {
    const detected = detectErrors('ذهبت، الى البيت.')[0];
    expect(detected.record.correct).toBe('إلى');
    expect(detected.start).toBe(6);
  });

  it('لا يغيّر النص تلقائيًا عند الاكتشاف', () => {
    const text = 'هذه مدرسه';
    detectErrors(text);
    expect(text).toBe('هذه مدرسه');
  });

  it('يكتشف العبارة المركبة ويحافظ على موضعها', () => {
    const result = detectErrors('سأزورك انشاء الله غدًا');
    expect(result[0].record.correct).toBe('إن شاء الله');
    expect(result[0].matchedText).toBe('انشاء الله');
  });

  it('يكتشف أخطاء مثال ظروف من دون أل التعريف', () => {
    const result = detectErrors('هاؤلاء يعملون في ضروف صعبه');
    expect(result.map((item) => item.record.correct)).toEqual(['هؤلاء', 'ظروف', 'صعبة']);
  });
});
