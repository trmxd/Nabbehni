import { describe, expect, it } from 'vitest';
import { spellingErrors } from '../data/errors';
import {
  createWatchQuestions,
  getClozeSentence,
  getPracticeSentence,
  orderRecordsForDay,
} from './practice';

function recordFor(incorrect: string) {
  const record = spellingErrors.find((candidate) => candidate.incorrect === incorrect);
  if (!record) throw new Error(`السجل غير موجود: ${incorrect}`);
  return record;
}

describe('أمثلة التدريب المرتبطة بقاعدة الإملاء', () => {
  it('يبني جملة فراغ من المثال الصحيح مع أل التعريف', () => {
    expect(getClozeSentence(recordFor('مدرسه'))).toBe('ذهبت إلى ______ صباحًا.');
  });

  it('يستخدم الجمل الصحيحة العامة كأمثلة بديلة', () => {
    expect(getPracticeSentence(recordFor('فاطمه'))).toBe('ذهبت فاطمة إلى المدرسة صباحًا.');
  });

  it('ينوّع ترتيب سجلات المراجعة بين الأيام', () => {
    const records = [recordFor('مدرسه'), recordFor('حديقه'), recordFor('مشكله')];
    const firstDay = orderRecordsForDay(records, new Date('2026-08-10T00:00:00Z'));
    const nextDay = orderRecordsForDay(records, new Date('2026-08-11T00:00:00Z'));
    expect(firstDay.map((record) => record.id)).not.toEqual(nextDay.map((record) => record.id));
  });

  it('ينشئ للساعة أسئلة اختيار وأسئلة إكمال من القاعدة نفسها', () => {
    const questions = createWatchQuestions(spellingErrors, new Date('2026-08-10T00:00:00Z'));
    expect(questions.length).toBeGreaterThan(20);
    expect(questions.some((question) => question.prompt === 'أيّهما صحيح؟')).toBe(true);
    expect(questions.some((question) => question.prompt === 'أكمل:' && question.context.includes('______'))).toBe(true);
    questions.forEach((question) => expect(question.options).toContain(question.correct));
  });
});
