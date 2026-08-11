import { correctPracticeSentences } from '../data/writingExamples';
import type { SpellingError } from '../types';

function sentenceWords(sentence: string): string[] {
  const matches = sentence.match(/[\p{L}\p{M}]+/gu);
  return matches ? Array.from(matches) : [];
}

export function getPracticeSentence(record: SpellingError): string | undefined {
  if (record.correctExample) return record.correctExample;
  return correctPracticeSentences.find((sentence) => {
    const words = sentenceWords(sentence);
    return words.includes(record.correct) || words.includes(`ال${record.correct}`);
  });
}

export function getClozeSentence(record: SpellingError): string | undefined {
  const sentence = getPracticeSentence(record);
  if (!sentence) return undefined;
  const words = sentenceWords(sentence);
  const matchedWord = words.includes(`ال${record.correct}`) ? `ال${record.correct}` : record.correct;
  return words.includes(matchedWord) ? sentence.replace(matchedWord, '______') : undefined;
}

export function orderRecordsForDay(
  records: readonly SpellingError[],
  date: Date = new Date(),
): SpellingError[] {
  if (records.length < 2) return [...records];
  const dayNumber = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
  const offset = ((dayNumber % records.length) + records.length) % records.length;
  return [...records.slice(offset), ...records.slice(0, offset)];
}

export interface WatchPracticeQuestion {
  id: string;
  prompt: 'أيّهما صحيح؟' | 'أكمل:';
  context: string;
  options: [string, string];
  correct: string;
}

export function createWatchQuestions(
  records: readonly SpellingError[],
  date: Date = new Date(),
): WatchPracticeQuestion[] {
  const uniqueRecords = records.filter((record, index, all) => (
    getPracticeSentence(record)
    && all.findIndex((candidate) => candidate.incorrect === record.incorrect) === index
  ));

  return orderRecordsForDay(uniqueRecords, date).map((record, index) => {
    const contextual = index % 2 === 1;
    const options: [string, string] = index % 4 < 2
      ? [record.correct, record.incorrect]
      : [record.incorrect, record.correct];
    return {
      id: record.id,
      prompt: contextual ? 'أكمل:' : 'أيّهما صحيح؟',
      context: contextual ? getClozeSentence(record) ?? '' : '',
      options,
      correct: record.correct,
    };
  });
}
